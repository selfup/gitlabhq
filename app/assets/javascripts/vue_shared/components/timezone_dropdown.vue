<script>
import { GlDropdown, GlDropdownItem, GlSearchBoxByType } from '@gitlab/ui';
import { __ } from '~/locale';
import autofocusonshow from '~/vue_shared/directives/autofocusonshow';

export default {
  name: 'TimezoneDropdown',
  components: {
    GlDropdown,
    GlDropdownItem,
    GlSearchBoxByType,
  },
  directives: {
    autofocusonshow,
  },
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
    timezoneData: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      searchTerm: '',
    };
  },
  tranlations: {
    noResultsText: __('No matching results'),
  },
  computed: {
    timezones() {
      return this.timezoneData.map(timezone => ({
        formattedTimezone: this.formatTimezone(timezone),
        identifier: timezone.identifier,
      }));
    },
    filteredResults() {
      const lowerCasedSearchTerm = this.searchTerm.toLowerCase();
      return this.timezones.filter(timezone =>
        timezone.formattedTimezone.toLowerCase().includes(lowerCasedSearchTerm),
      );
    },
    selectedTimezoneLabel() {
      return this.value || __('Select timezone');
    },
  },
  methods: {
    selectTimezone(selectedTimezone) {
      this.$emit('input', selectedTimezone);
      this.searchTerm = '';
    },
    isSelected(timezone) {
      return this.value === timezone.formattedTimezone;
    },
    formatUtcOffset(offset) {
      const parsed = parseInt(offset, 10);
      if (Number.isNaN(parsed) || parsed === 0) {
        return `0`;
      }
      const prefix = offset > 0 ? '+' : '-';
      return `${prefix}${Math.abs(offset / 3600)}`;
    },
    formatTimezone(item) {
      return `[UTC ${this.formatUtcOffset(item.offset)}] ${item.name}`;
    },
  },
};
</script>
<template>
  <gl-dropdown :text="selectedTimezoneLabel" block lazy menu-class="gl-w-full!">
    <gl-search-box-by-type v-model.trim="searchTerm" v-autofocusonshow autofocus />
    <gl-dropdown-item
      v-for="timezone in filteredResults"
      :key="timezone.formattedTimezone"
      :is-checked="isSelected(timezone)"
      :is-check-item="true"
      @click="selectTimezone(timezone)"
    >
      {{ timezone.formattedTimezone }}
    </gl-dropdown-item>
    <gl-dropdown-item
      v-if="!filteredResults.length"
      class="gl-pointer-events-none"
      data-testid="noMatchingResults"
    >
      {{ $options.tranlations.noResultsText }}
    </gl-dropdown-item>
  </gl-dropdown>
</template>
