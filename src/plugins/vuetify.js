import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        primary: '#108DDF',
        secondary: '#424242',
        accent: '#1C5F9D',
        error: '#FF5252',
        info: '#3B9FE6',
        success: '#4CAF50',
        warning: '#FFC107',
        white:'#FFF',
        text_head: '#000'
      },
      dark: {
        primary: '#108DDF',
        secondary: '#424242',
        accent: '#1C5F9D',
        error: '#FF5252',
        info: '#3B9FE6',
        success: '#4CAF50',
        warning: '#FFC107',
        white:'#FFF',
        text_head:'#f0f8ff'
      },
    },
  },
});
