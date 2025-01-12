import { mount, shallowMount } from '@vue/test-utils'
import { 
    describe, expect, it, vi, test
} from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import HelloWorld from './HelloWorld.vue'

const vuetify = createVuetify({
    components,
    directives,
  })

const getMountOptions = (props = {}) => ({
    global: {
        plugins: [
            vuetify
        ]
    },
    props: {
    }
})

const shallowMountComponent = (props = {}) => shallowMount(HelloWorld, getMountOptions(props));
const mountComponent = (props = {}) => mount(HelloWorld, getMountOptions(props));

describe('HelloWorld.vue', () => {
    it('renders the welcome message', () => {
        const wrapper = mountComponent();
        expect(wrapper.text()).toContain('Welcome to');
        expect(wrapper.text()).toContain('Memories');
      });
})