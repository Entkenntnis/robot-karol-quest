import { deStrings } from './de'

export const enStrings: typeof deStrings = {
  overview: {
    profile: 'Profile',
    editor: 'Editor',
    save: 'Save',
    saveTooltip: 'Save to a file',
    load: 'Load',
    loadTooltip: 'Load from a file',
    gameState: 'gamestate',
    lucky: "I'm Feeling Lucky",
    version: 'Version: April 2024',
    playground: 'Playground',
    imprint: 'Imprint',
    privacy: 'Privacy Policy',
    showAll: 'List of all tasks',
    closeShowAll: 'Close List of all tasks',
    game: 'Mini-Game',
    storeOnDevice: 'Save progress on this device?',
    later: 'later',
  },
  nameModal: {
    title: 'Welcome!',
    invite: 'What is your name?',
    hint: 'Your name will be displayed publicly.',
    random: 'random name',
    start: 'Get started!',
  },
  ide: {
    backToOverview: 'Back to overview',
    save: 'Save',
    blocks: 'Blocks',
    structogram: 'Structogram',
    welcome:
      "Welcome! Here, you'll step by step get to know the world of Karol. The tutorial will guide you through the fundamental aspects of programming.",
    tutorialButton: 'Show Tutorial',
    start: 'Start',
    stop: 'Stop',
    ready: 'ready',
    not: 'not',
    completed: 'completed',
    back: 'back',
    assignment: 'Assignment',
    assignments: 'Assignments',
    continue: 'Continue',
    done: 'Done',
    continueAll: 'continue (test all assignments)',
    steps: 'steps per second',
    programError: 'Incomplete program',
    loading: 'Loading program ...',
    running: 'Running program',
    error: 'Error',
    endOfRun: 'End of execution',
    aborted: 'aborted',
    clear: 'Clear output',
    taskCompleted: 'completed',
    thereAreErrors: 'The following issues occurred while loading the program:',
    close: 'Close',
    connectAll: 'Connect all blocks of the main program.',
    stay: 'stay',
    exit: 'continue',
    read: 'Read the instructions',
    language: 'Language',
    problems: 'The following problems occurred',
    line: 'Line',
  },
  profile: {
    title: 'Profile',
    close: 'Close',
    username: 'Username',
    noname: 'No name set yet',
    solved: 'Solved Tasks',
    of: 'of',
    persist: 'Save progress permanently on this device',
    reset: 'Reset progress',
    resetConfirm: 'Reset progress now?',
  },
  highscore: {
    close: 'Close',
    rank: 'Rank',
    name: 'Name',
    solved: 'Solved Tasks',
    lastActive: 'Last Active',
    sortByActivity: 'Sort by Last Activity',
    sortBySolved: 'Sort by Solved Tasks',
    currentPlayers: 'players in the last 28 days',
    joined: 'joined',
    loading: 'Fetching data ...',
  },
  lucky: {
    description: 'Open a randomly shared task.',
    button: 'Open Random Task',
    hint: 'The content is created by users and is freely usable.',
    close: 'Close',
  },
  outfit: {
    title: "Customize Karol's Appearance",
    close: 'Close',
    cap: 'Cap',
    shirt: 'Shirt',
    legs: 'Pants',
    skin: 'Skin Tone',
    suggest: 'Suggest outfit',
  },
  imprint: {
    title: 'Imprint',
    close: 'Close',
  },
  crash: {
    invalidMove: 'Karol cannot move in this direction.',
    invalidHeight: 'Karol cannot overcome this height.',
    invalidBrick: 'Karol cannot place a brick here.',
    maxHeight: 'Maximum stack height reached.',
    invalidPick: 'Karol cannot pick up a brick here.',
    noBricks: 'No bricks to pick up.',
    invalidBlock: 'Karol cannot place a block here.',
    noBlockOnBrick: 'Karol cannot place a block on a brick.',
    noBlockOnMark: 'Karol cannot place a block on a mark.',
  },
  quest: {
    warn: 'The text mode is not translated yet and only available in German. You can proceed anyways.',
  },
  editor: {
    edit: 'Edit',
    preview: 'Preview',
    leave: 'Leave Editor',
    leaveWarning: 'Your changes will not be saved. Leave?',
    title: 'Title of the Exercise',
    description: 'Describe what the exercise is about ...',
    newTask: 'New Task',
    test: 'Test',
    editWorld: 'Edit World',
    up: 'Up',
    down: 'Down',
    duplicate: 'Duplicate Task',
    delete: 'Delete Task',
    addTask: 'Add Task',
    publish: 'Publish Exercise',
    loadFrom: 'Load from Template',
    load: 'Load',
    close: 'Close',
    fromCode: 'From a shared exercise, enter the four-character code',
    fromQuest: 'From an existing exercise',
    pleaseChoose: '--- please choose ---',
    share: 'Share',
    shareDescription:
      'Share your task and make it available online. The data will be stored on the server. By sharing, you agree to release the exercise under {{CC0}} and allow it to be reused.',
    createLink: 'Create Link',
    loading: 'loading ...',
    openInNewTab: 'Open Link in New Tab',
    back: 'Back',
    changeSize: 'Change World Size',
    startWorld: 'Start World',
    endWorld: 'End World',
    copyStartToEnd: 'Copy Start to End',
    createNewWorld: 'Create New World',
    width: 'Width',
    length: 'Length',
    height: 'Height',
    keepWorld: 'Keep World Contents',
    create: 'Create World',
  },
}
