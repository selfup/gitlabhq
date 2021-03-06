<script>
import { GlTable, GlIcon, GlTooltipDirective } from '@gitlab/ui';
import { s__, __ } from '~/locale';
import Tracking from '~/tracking';
import { trackAlertIntergrationsViewsOptions } from '../constants';

export const i18n = {
  title: s__('AlertsIntegrations|Current integrations'),
  emptyState: s__('AlertsIntegrations|No integrations have been added yet'),
  status: {
    enabled: {
      name: __('Enabled'),
      tooltip: s__('AlertsIntegrations|Alerts will be created through this integration'),
    },
    disabled: {
      name: __('Disabled'),
      tooltip: s__('AlertsIntegrations|Alerts will not be created through this integration'),
    },
  },
};

const bodyTrClass =
  'gl-border-1 gl-border-t-solid gl-border-b-solid gl-border-gray-100 gl-hover-cursor-pointer gl-hover-bg-blue-50 gl-hover-border-blue-200';

export default {
  i18n,
  components: {
    GlTable,
    GlIcon,
  },
  directives: {
    GlTooltip: GlTooltipDirective,
  },
  props: {
    integrations: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  fields: [
    {
      key: 'activated',
      label: __('Status'),
    },
    {
      key: 'name',
      label: s__('AlertsIntegrations|Integration Name'),
    },
    {
      key: 'type',
      label: __('Type'),
    },
  ],
  computed: {
    tbodyTrClass() {
      return {
        [bodyTrClass]: this.integrations.length,
      };
    },
  },
  mounted() {
    this.trackPageViews();
  },
  methods: {
    trackPageViews() {
      const { category, action } = trackAlertIntergrationsViewsOptions;
      Tracking.event(category, action);
    },
  },
};
</script>

<template>
  <div class="incident-management-list">
    <h5 class="gl-font-lg">{{ $options.i18n.title }}</h5>
    <gl-table
      :empty-text="$options.i18n.emptyState"
      :items="integrations"
      :fields="$options.fields"
      stacked="md"
      :tbody-tr-class="tbodyTrClass"
      show-empty
    >
      <template #cell(activated)="{ item }">
        <span v-if="item.activated" data-testid="integration-activated-status">
          <gl-icon
            v-gl-tooltip
            name="check-circle-filled"
            :size="16"
            class="gl-text-green-500 gl-hover-cursor-pointer gl-mr-3"
            :title="$options.i18n.status.enabled.tooltip"
          />
          {{ $options.i18n.status.enabled.name }}
        </span>
        <span v-else data-testid="integration-activated-status">
          <gl-icon
            v-gl-tooltip
            name="warning-solid"
            :size="16"
            class="gl-text-red-600 gl-hover-cursor-pointer gl-mr-3"
            :title="$options.i18n.status.disabled.tooltip"
          />
          {{ $options.i18n.status.disabled.name }}
        </span>
      </template>
    </gl-table>
  </div>
</template>
