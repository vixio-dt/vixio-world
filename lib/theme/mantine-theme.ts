import { Button, createTheme, Modal, Paper, Select, Textarea, TextInput } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'cyan',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  defaultRadius: 'md',
  components: {
    Button: Button.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    Textarea: Textarea.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    Select: Select.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
    Modal: Modal.extend({
      defaultProps: {
        radius: 'md',
      },
    }),
  },
});
