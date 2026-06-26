import { Box, Text, useApp, useInput } from '@vue-tui/runtime'
import { defineComponent, h } from 'vue'

export const CardApp = defineComponent({
  name: 'CardApp',
  setup() {
    const app = useApp()

    useInput((input, key) => {
      if (key.escape || input === 'q') {
        app.exit()
      }
    })

    return () =>
      h(
        Box,
        {
          borderStyle: 'round',
          flexDirection: 'column',
          paddingX: 2,
          paddingY: 1,
          width: 36
        },
        () => [
          h(Box, { height: 3 }),
          h(
            Box,
            {
              borderBottom: false,
              borderLeft: false,
              borderRight: false,
              borderStyle: 'single',
              flexDirection: 'row',
              paddingTop: 1
            },
            () => [
              h(Text, { bold: true }, () => 'Liang'),
              h(Text, { dimColor: true }, () => ' (liangmiQwQ)')
            ]
          )
        ]
      )
  }
})
