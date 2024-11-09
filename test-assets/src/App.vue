<template :ref="app">
  <div>
    <html-page v-if="emailNode && dataLoaded" class="render-off-screen" />
    <Default>
      <notifications class="notifications" :width="350"></notifications>

      <loading-view v-if="view === 'loading'">Loading</loading-view>
      <error-page v-if="view === 'Error'"></error-page>
      <editor-panes v-if="dataLoaded"></editor-panes>
    </Default>
    <PortalTarget name="editor-app-root"></PortalTarget>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { editorModule, EditorType, EditorView } from '@/store/modules/editor/index.ts';
import Default from '@/layouts/Default.vue';
import FetchDataHelper from '@/utilities/FetchDataHelper';
import LoadingView from '@/views/LoadingView.vue';
import ErrorPage from '@/views/ErrorPage.vue';
import Echo from 'laravel-echo';
import { companyModule } from '@/store/modules/company';
import { startupModule } from '@/store/modules/startup';
import { StartupAction } from '@/store/modules/module/StartupAction';
import HtmlPage from '@/components/html/structure/HtmlPage.vue';
import { moduleModule } from '@/store/modules/module';
import { commentModule } from '@/store/modules/comment';
import { IComment } from '@/services/kml-parsing/interfaces';
import { JsonApi } from '@/services/api/jsonApi';
import { lockingModule } from '@/store/modules/locking';
import SaveEmailMixin from '@/components/helpers/SaveEmailMixin';
import { mixins } from 'vue-class-component';
import EditorEventBus from '@/utilities/EditorEventBus';
import { brandModule } from '@/store/modules/brand';
import { IModule, PlatformMetadata } from '@knak/knode/dist/interfaces';
import { segmentsModule } from '@/store/modules/segments';
import { AssetType } from '@knak/knode/dist/defs';
import EditorLayout from '@/layouts/EditorLayout.vue';
import EditorPanes from '@/layouts/EditorPanes.vue';
import { assistantModule } from '@/store/modules/assistant';
import axios from 'axios';
import { PortalTarget } from 'portal-vue';
import { useAssetPlatformMetadataStore } from '@/stores';
import { useOptimizeStore } from '@/stores/OptimizeStore';
import AssetCollection from '@/types/AssetCollection';

@Component({
  components: {
    EditorPanes,
    EditorLayout,
    LoadingView,
    HtmlPage,
    Default,
    ErrorPage,
    PortalTarget,
  },
})
export default class App extends mixins(SaveEmailMixin) {
  @Provide('renderDesktopPreview') private renderDesktopPreviewProvide: boolean = true;

  dataLoaded: boolean = false;
  fetchDataHelper: FetchDataHelper = new FetchDataHelper(this.loadingComplete);
  currentSubject = '';
  isValidMarketoSubject = false;
  optimizeStore = useOptimizeStore();

  parsePath() {
    const path: string = window.location.pathname;
    const pathArr = path.split('/');
    const queryString = window.location.search;
    const queryHash: Record<string, string> = {};
    if (queryString.indexOf('?') >= 0) {
      const withoutQuestionMark = queryString.substring(1);
      const queryStrings = withoutQuestionMark.split('&');
      for (const queryStringParameter of queryStrings) {
        const splitParameters = queryStringParameter.split('=');
        if (splitParameters.length === 2) {
          queryHash[splitParameters[0]] = splitParameters[1];
        }
      }
    }

    const editedItemId = pathArr.pop();
    if (!editedItemId) {
      return null;
    }
    const type = pathArr.pop();

    const { hash } = window.location;
    return { queryHash, editedItemId, hash, type: type || 'builder' };
  }

  get emailNode() {
    return editorModule.emailNode;
  }

  get email() {
    return editorModule.email;
  }

  get integrations() {
    return brandModule.integrations;
  }

  get modules() {
    return moduleModule.kmodulesInEmail;
  }

  @Watch('email', { deep: true })
  async onEmailChanged() {
    if (this.email) {
      await this.validateSubjectLine();
      this.optimizeStore.isValidMarketoSubject = this.isValidMarketoSubject;
      if (editorModule.editorType === EditorType.Asset) {
        this.optimizeStore.runDebouncedTests();
      }
    }
  }

  private async validateSubjectLine() {
    if (
      this.email &&
      this.currentSubject !== this.email.subject &&
      this.email.platform === 'marketo'
    ) {
      this.currentSubject = this.email.subject;
      let urlPrefix = import.meta.env.VITE_APP_API_URL;
      if (!urlPrefix) {
        urlPrefix = `${window.location.protocol}//${window.location.host}`;
      }
      await axios
        .post(`${urlPrefix}/marketo-validation/validate-subject`, {
          subject: this.currentSubject,
        })
        .then((response: { data: { valid: boolean } }) => {
          this.isValidMarketoSubject = response.data.valid;
        });
    }
  }

  @Watch('modules', { deep: true })
  onModulesChanged(newModules: AssetCollection<IModule>) {
    if (newModules) {
      if (editorModule.editorType === EditorType.Asset) {
        this.optimizeStore.runDebouncedTests();
      }
    }
  }

  @Watch('integrations', { deep: true })
  onIntegrationsChanged() {
    if (this.integrations) {
      if (editorModule.editorType === EditorType.Asset) {
        this.optimizeStore.runDebouncedTests();
      }
    }
  }

  private setupEcho() {
    const pusherKey = companyModule.builderConfig!.pusherKey;
    const pusherCluster = companyModule.builderConfig!.pusherCluster;
    const urlPrefix = JsonApi.getUrlPrefix();
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: pusherKey,
      cluster: pusherCluster,
      authEndpoint: `${urlPrefix}/broadcasting/auth`,
    });

    assistantModule.setEchoAction(this.echo);
  }

  loadingComplete() {
    this.setupEcho();
    this.dataLoaded = true;
    editorModule.autoSaveHelper
      .instance()
      .setLastSavedObjects(editorModule.editedItem, editorModule.emailNode!, false);

    if (editorModule.editorType === EditorType.Asset) {
      this.echo
        .private(this.getPusherChannel())
        .listen('DynamicPreviewCreated', (e: any) => {
          if (e.type === 'desktop') {
            editorModule.email!.previewPath = e.full_path;
          }
        })
        .listen('CommentEditorNotification', (e: any) => {
          const comment = JsonApi.getFirstFromData<IComment>(e, 'comment');
          if (e.action_type === 'delete') {
            commentModule.removeComment(comment);
          } else {
            comment.isFromBroadcast = true;
            commentModule.addComment(comment);
          }
        })
        .listen('TypingNotification', (e: any) => {
          commentModule.setTypingNotification(e.typing_notifications);
        })
        .listen('AssetPlatformMetadataUpdating', () => {
          useAssetPlatformMetadataStore().metadataIsUpdating();
        })
        .listen('AssetPlatformMetadataUpdated', (e: { metadata: PlatformMetadata[] }) => {
          useAssetPlatformMetadataStore().updatedMetadata(e.metadata);
        });
    }

    const channel = this.getPusherChannel();
    if (channel) {
      this.echo
        .private(channel)
        .listen('EditingLockChanged', (e: any) => {
          editorModule.editingLockService.setLockingUser(e.locked, e.user_id, e.uuid);
        })
        .listen('EditorItemSaved', (e: any) => {
          if (!editorModule.editingLockService.isEditing()) {
            editorModule.refreshEditorItem(true);
          }
        })
        .listen('TranslationRequestStatusNotification', (e: any) => {
          if (e && e.email_id) {
            editorModule.updateAssetTranslationRequests(e.email_id);
          }
        })
        .listen('EmailOptionsUpdated', (e: any) => {
          if (e && e.email_id) {
            editorModule.updateLinkedProjectManagementEmailOptions(e.email_id);
          }
        })
        .listen('ProjectManagementStatusUpdated', (e: any) => {
          if (e?.email_id && e?.entity_id) {
            editorModule.getProjectManagementStatus(e.entity_id);
          }
        });
    }

    this.echo
      .private(`model.KnakDynamicSegment.${companyModule.builderConfig?.companyId}`)
      .listen('ModelUpdated', (e: any) => {
        if (editorModule.assetType === AssetType.Email && editorModule.emailId) {
          segmentsModule.fetchDynamicSegments({ emailId: editorModule.emailId });
        } else {
          segmentsModule.fetchDynamicSegments({});
        }
      });
  }

  getPusherChannel() {
    switch (editorModule.editorType) {
      case EditorType.Asset:
        return `email.${editorModule.email!.id}`;
      case EditorType.Module:
        return `module.${editorModule.module!.id}`;
      case EditorType.Theme:
        return `theme.${editorModule.theme!.id}`;
    }
  }

  setDesiredStartView(hash: string) {
    if (editorModule.editorType !== EditorType.Asset) return;

    const hashString = hash.replace('#', '') as EditorView;
    if (
      Object.values(EditorView).includes(hashString) &&
      editorModule.editorType === EditorType.Asset
    ) {
      editorModule.setCurrentView(hashString);
      return;
    }

    switch (hash.toLowerCase()) {
      case '#collaborate':
        editorModule.setCurrentView(EditorView.Collaborator);
        break;
      case '#approval':
        editorModule.setCurrentView(EditorView.Approval);
        break;
      case '#info':
        editorModule.setCurrentView(EditorView.EmailInfo);
        break;
      default:
        const defaultHash = this.createTabEnabled ? EditorView.Editor : EditorView.EmailInfo;
        editorModule.setCurrentView(defaultHash);
        window.location.hash = `#${defaultHash}`;
        break;
    }
  }

  setApprovalView() {
    editorModule.setCurrentView(EditorView.Approval);
  }

  handleScroll(event: any) {
    if (event.ctrlKey === true) {
      event.preventDefault();
      if (event.deltaY > 0) {
        editorModule.zoomOut();
      } else {
        editorModule.zoomIn();
      }
    }
  }

  mounted() {
    window.addEventListener('wheel', this.handleScroll, { passive: false });
    window.onbeforeunload = () => {
      EditorEventBus.beforeUnloadEarly();
      if (editorModule.editingLockService.isEditing()) {
        editorModule.setLoadingEmail(true);
        if (editorModule.autoSaveHelper.instance()) {
          editorModule.autoSaveHelper.instance().stopAutoSaveTimer();
        }
        if (editorModule.editingLockService) {
          editorModule.editingLockService.stopAllTimers();
        }
        switch (editorModule.editorType) {
          case EditorType.Asset:
            if (editorModule.omitSaveOnBeforeUnload) {
              editorModule.context.dispatch('finishOmitOnBeforeSaveOnLoad');
              lockingModule.releaseEditingLock();
            } else {
              this.saveEmailIfPossible(true);
            }
            break;
          case EditorType.Module:
            editorModule.saveModule({ autoSave: false, releaseLock: true });
            break;
          case EditorType.Theme:
            editorModule.saveTheme({ autoSave: false, releaseLock: true });
            break;
        }
      }
    };
    if (Vue.logger) {
      Vue.logger.updateConfig(companyModule.loggingConfig);
    }

    setTimeout(() => {
      this.tryLoadApplication();
    });
  }

  tryLoadApplication() {
    // Due to a catch-22 with tippy, we are unable to change the order of script loading.  We instead need to
    // wait for the global company object to be populated.  We will revisit this when we move to a full SPA.
    if (!!window.company) {
      companyModule.mapPreferencesFromCompanyObjectInGlobalJavascript();
      this.loadApplication();
    } else {
      console.log('Waiting for company object to be populated');
      setTimeout(() => {
        this.tryLoadApplication();
      }, 20);
    }
  }

  get createTabEnabled() {
    return this.emailPolicy().canUpdate();
  }

  loadApplication() {
    const pathComponents = this.parsePath();
    editorModule.setQueryHash(pathComponents ? pathComponents.queryHash : {});
    if (!pathComponents) {
      return;
    }
    this.fetchDataHelper
      .fetchData(pathComponents.type, pathComponents.editedItemId)
      .catch((error) => {
        this.$notifyError(error);
        editorModule.setCurrentView(EditorView.Error);
      })
      .then(() => {
        if (pathComponents.queryHash.approve && pathComponents.queryHash.approve === 'true') {
          this.setApprovalView();
          startupModule.setStartupAction(StartupAction.Approve);
        } else if (pathComponents.queryHash.reject && pathComponents.queryHash.reject === 'true') {
          this.setApprovalView();
          startupModule.setStartupAction(StartupAction.Reject);
        } else {
          this.setDesiredStartView(pathComponents.hash);
        }
      });
  }

  get view(): string {
    if (this.dataLoaded || editorModule.currentView === EditorView.Error) {
      return editorModule.currentView;
    }
    return 'loading';
  }

  destroyed() {
    this.echo.leave(this.getPusherChannel());
  }
}
</script>

<style lang="scss" scoped>
.render-off-screen {
  position: fixed;
  top: -100000px;
  left: -100000px;
  width: 2000px;
}
</style>

<style lang="scss">
body {
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: var(--color-grey-light-dark, #646464);
  }

  ::-webkit-scrollbar-track-piece {
    background-color: var(--color-grey-lightest-darkest, #30353c);
  }

  ::-webkit-scrollbar-thumb {
    height: 50px;
    background-color: var(--color-grey-light-dark, #5d5d5d);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-corner {
    background-color: var(--color-grey-light-dark, #222);
  }
}
h2.white {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
}

.notifications {
  position: absolute !important;
}
</style>
