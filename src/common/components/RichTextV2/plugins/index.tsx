import {
  createParagraphPlugin,
  createHeadingPlugin,
  createBlockquotePlugin,
  createListPlugin,
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createCodePlugin,
  createResetNodePlugin,
  createExitBreakPlugin,
  createSoftBreakPlugin,
  createAutoformatPlugin,
  createPlugins,
  createPlateUI,
  createTodoListPlugin,
} from '@udecode/plate'

import { autoformatOptions } from '../configs/autoformatRules'
import { exitBreakOptions } from '../configs/exitBreakOptions'
import { resetNodeOptions } from '../configs/resetNodeOptions'
import { softBreakOptions } from '../configs/softExitOptions'

export const plugins = createPlugins(
  [
    /** Element */
    createParagraphPlugin(),
    createHeadingPlugin(),
    createBlockquotePlugin(),
    createListPlugin(),
    createTodoListPlugin(),
    /** Mark */
    createBoldPlugin(),
    createItalicPlugin(),
    createUnderlinePlugin(),
    createStrikethroughPlugin(),
    createCodePlugin(),
    /* *Other */
    createExitBreakPlugin({ options: exitBreakOptions }),
    createResetNodePlugin({ options: resetNodeOptions }),
    createSoftBreakPlugin({ options: softBreakOptions }),
    createAutoformatPlugin({ options: autoformatOptions }),
  ],
  {
    components: createPlateUI(),
  }
)
