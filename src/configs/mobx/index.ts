import { configure } from 'mobx'

// mobox's default configuration
export const mobxConfiguration = () =>
  configure({
    enforceActions: 'observed',
    computedRequiresReaction: false,
    reactionRequiresObservable: false,
    observableRequiresReaction: false,
    disableErrorBoundaries: false,
  })
