<template>
  <div>
    <!--      Google-->
    <h4>Campaign Details</h4>

    <generic-attribute>
      <template v-slot:label>
        Audience
        <i
          v-if="!hasGoogleSheetRecord"
          class="fad fa-info-circle info-icon"
          v-tippy
          title="If submitting a Content Alert (CA) or Content Alert Visual (CAV), please identify whether it should be Local or Global. For custom audience segmentation, please select Custom."
        ></i>
      </template>

      <div v-if="!hasGoogleSheetRecord">
        <k-form-select :options="audienceOptions" v-model="selectedAudienceOption" asKui>
        </k-form-select>
      </div>
      <div v-else class="locked-input">
        {{ audience }}
      </div>
    </generic-attribute>

    <generic-attribute v-if="selectedAudienceOption === 'Custom' && !hasGoogleSheetRecord">
      <template v-slot:label> Custom Audience </template>

      <k-form-input
        :autoFocus="true"
        :variant="hasGoogleSheetRecord ? 'disabled' : 'dark'"
        ref="audienceTextbox"
        :disabled="!canUpdateEmailSettings || hasGoogleSheetRecord"
        v-model="audience"
        placeholder="Example: Only send to recipients in a specific country"
      ></k-form-input>
    </generic-attribute>

    <div>
      <generic-attribute>
        <template v-slot:label>
          Test Approval # <audit-icon audit-id="test-approval"></audit-icon>
        </template>

        <k-form-input
          :variant="hasGoogleSheetRecord ? 'disabled' : 'dark'"
          ref="testApprovalIdTextbox"
          :disabled="!canUpdateEmailSettings || hasGoogleSheetRecord"
          v-model="testApprovalId"
          placeholder=""
          v-if="!hasGoogleSheetRecord"
        ></k-form-input>
        <div v-else class="locked-input">
          {{ testApprovalId }}
        </div>
      </generic-attribute>

      <generic-attribute v-if="testApprovalId !== ''">
        <template v-slot:label> Email Type </template>

        <k-form-select
          :options="testApprovalEmailTypeOptions"
          v-model="selectedTestApprovalEmailType"
          v-if="!hasGoogleSheetRecord"
        >
        </k-form-select>
        <div v-else class="locked-input">
          {{ selectedTestApprovalEmailType }}
        </div>
      </generic-attribute>
    </div>

    <generic-attribute>
      <template v-slot:label>
        Scheduled
        <audit-icon audit-id="scheduled-time"></audit-icon>
      </template>

      <div
        class="scheduled-time-input"
        v-if="!hasGoogleSheetRecord"
        @click="showScheduledTimeModal = true"
      >
        {{ scheduleDisplay }}
        <i class="fal fa-calendar" v-if="!hasGoogleSheetRecord"></i>
      </div>
      <div v-else class="locked-input">
        {{ scheduleDisplay }}
      </div>

      <date-time-modal
        @setTime="setScheduledTimeInfo"
        v-if="showScheduledTimeModal && !hasGoogleSheetRecord"
        :scheduled-time="email.optionsArray.scheduledTime"
        :time-zone="email.optionsArray.scheduledTimeZone"
        @close="showScheduledTimeModal = false"
      />
    </generic-attribute>

    <generic-attribute v-if="showContentThemeInput">
      <template v-slot:label> Content Theme </template>

      <k-form-select
        :options="contentThemeOptions"
        v-model="selectedContentTheme"
        v-if="!hasGoogleSheetRecord"
        asKui
      >
      </k-form-select>
      <div v-else class="locked-input">
        {{ selectedContentTheme }}
      </div>
    </generic-attribute>
    <div v-if="hasGoogleSheetRecord" class="success-message">
      Thank you for submitting your email campaign request.
    </div>
    <div class="disclaimer">
      <p>
        Your campaign submission details and email address will be used in Campaign Launch Calendar
        (go/campaign-launch-calendar) to offer more transparency to Global, Regional, and Local PMMs
        on planned email activities.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-facing-decorator';
import { editorModule } from '@/store/modules/editor';
import moment from 'moment-timezone';
import GenericAttribute from '@/components/controls/attributes/element/GenericAttribute.vue';
import DateTimeModal from '@/components/assets/time-picker/DateTimeModal.vue';
import AuditIcon from '@/components/assets/knak/AuditIcon.vue';
import { IKFormSelect } from '@/components/assets/knak/KTypes';
import LockingMixin from '@/components/helpers/LockingMixin';
import { mixins } from 'vue-facing-decorator';
import { companyModule } from '@/store/modules/company';

@Component({
  components: {
    AuditIcon,
    DateTimeModal,
    GenericAttribute,
  },
})
export default class CampaignDetails extends mixins(LockingMixin) {
  moment = moment;
  scheduledTime: string = '';
  scheduledTimeZone: string = '';
  audience: string = this.email.optionsArray.audience || '';
  showScheduledTimeModal = false;
  labelWidth: Number = 150;
  selectedAudienceOption = '';
  testApprovalId: string = this.email.optionsArray.testApprovalId || '';
  selectedTestApprovalEmailType: string = this.email.optionsArray.testApprovalEmailType || '';
  selectedContentTheme: string = this.email.optionsArray.selectedContentTheme || 'None';

  audienceOptions: IKFormSelect['options'] = [
    { value: 'Standard', text: 'Standard' },
    { value: 'Global', text: 'Global' },
    { value: 'Local', text: 'Local' },
    { value: 'Multi Feature List', text: 'Multi Feature List' },
    { value: 'Custom', text: 'Custom' },
  ];

  testApprovalEmailTypeOptions: IKFormSelect['options'] = [
    { value: 'Email A (Control)', text: 'Email A (Control)' },
    { value: 'Email B (Test)', text: 'Email B (Test)' },
    { value: 'Not Applicable', text: 'Not Applicable' },
  ];

  contentThemeOptions: IKFormSelect['options'] = [
    { value: 'Consumer Journey', text: 'Consumer Journey' },
    { value: 'Consumer Trends', text: 'Consumer Trends' },
    { value: 'App + Mobile', text: 'App + Mobile' },
    { value: 'Data + Measurement', text: 'Data + Measurement' },
    { value: 'Monetization', text: 'Monetization' },
    { value: 'AI', text: 'AI' },
    { value: 'Search', text: 'Search' },
    { value: 'Video', text: 'Video' },
    { value: 'Creativity', text: 'Creativity' },
    { value: 'Digital Transformation', text: 'Digital Transformation' },
    { value: 'Diversity and Inclusion', text: 'Diversity and Inclusion' },
    { value: 'Emerging Technology', text: 'Emerging Technology' },
    { value: 'Management & Culture', text: 'Management & Culture' },
    { value: 'Privacy & Trust', text: 'Privacy & Trust' },
    { value: 'None', text: 'None' },
  ];

  @Watch('selectedAudienceOption')
  selectedAudienceOptionUpdated() {
    if (this.selectedAudienceOption === 'Custom') {
      // If the custom value is set to something in the options array, clear the audience field
      if (
        this.audienceOptions.find((option) => option.value === this.email.optionsArray.audience)
      ) {
        this.audience = '';
      }
    } else {
      this.audience = this.selectedAudienceOption;
    }
  }

  created() {
    this.selectedAudienceOption = this.getSelectedAudienceOption();
  }

  get showContentThemeInput() {
    return companyModule.getPreferenceValue('add_content_theme_to_google_sheets_campaign_details');
  }

  getSelectedAudienceOption(): string {
    if (!this.email.optionsArray.audience) {
      return 'Standard';
    }

    const audienceOption = this.audienceOptions.find(
      (option) => option.value === this.email.optionsArray.audience
    );

    if (audienceOption) {
      return audienceOption.value as string;
    }

    this.audience = this.email.optionsArray.audience;
    return 'Custom';
  }

  @Watch('audience')
  updateAudience() {
    editorModule.updateEmailOptionsArray({
      audience: this.audience,
    });
  }

  @Watch('testApprovalId')
  updateTestApprovalId() {
    if (this.selectedTestApprovalEmailType === '') {
      this.selectedTestApprovalEmailType = 'Email A (Control)';
    }
    if (this.testApprovalId === '') {
      this.selectedTestApprovalEmailType = '';
    }
    editorModule.updateEmailOptionsArray({
      testApprovalId: this.testApprovalId,
    });
  }

  @Watch('selectedTestApprovalEmailType')
  updateSelectedTestApprovalEmailType() {
    editorModule.updateEmailOptionsArray({
      testApprovalEmailType: this.selectedTestApprovalEmailType,
    });
  }

  @Watch('selectedContentTheme')
  updateSelectedContentTheme() {
    editorModule.updateEmailOptionsArray({
      selectedContentTheme: this.selectedContentTheme,
    });
  }

  get hasGoogleSheetRecord() {
    return this.email.optionsArray.hasGoogleSheetRecord;
  }

  get email() {
    return editorModule.email!;
  }

  setScheduledTimeInfo(timeInfo: { scheduledTime: string; timeZone: string }) {
    this.showScheduledTimeModal = false;
    editorModule.updateEmailOptionsArray({
      scheduledTime: timeInfo.scheduledTime,
      scheduledTimeZone: timeInfo.timeZone,
    });
  }

  get scheduleDisplay() {
    if (this.email.optionsArray.scheduledTime) {
      const momentValue = moment.tz(
        this.email.optionsArray.scheduledTime,
        '',
        true,
        this.email.optionsArray.scheduledTimeZone
      );
      return momentValue.format('ddd, MMM D, h:mma z');
    }
    return 'Choose a date...';
  }
}
</script>

<style lang="scss" scoped>
h4 {
  margin: 0.5em 0 1em 0;
}

hr {
  border-color: var(--border-color, $grey-dark-theming);
}

.disclaimer {
  font-size: var(--font-size-sm, 12px);
}
.audience {
  input {
    font-size: 14px !important;
  }
}
.info-icon {
  padding-top: 5px;
}
.locked-input {
  padding: 6px;
}
.success-message {
  background: var(--color-brand-success-lightest-darkest, #376237) !important;
  text-align: center;
  padding: 7px;
  border-radius: 5px;
}
.scheduled-time-input {
  color: var(--color-black-white, $white);
  background: var(--color-grey-white-darker, $grey-darker-theming);
  border: 1px solid var(--border-color, $grey-dark-theming);
  padding: 6px 12px;
  border-radius: 0.25rem;
  cursor: pointer;
  i {
    padding-top: 4px;
    float: right;
  }
}
.pacific-time {
  color: var(--color-grey-light-dark, $grey-dark-theming);
  font-size: 14px;
  margin-top: 10px;
}
</style>
