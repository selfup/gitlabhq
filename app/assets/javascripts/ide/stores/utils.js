export const dataStructure = () => ({
  id: '',
  key: '',
  type: '',
  projectId: '',
  branchId: '',
  name: '',
  url: '',
  path: '',
  level: 0,
  tempFile: false,
  icon: '',
  tree: [],
  loading: false,
  opened: false,
  active: false,
  changed: false,
  lastCommitPath: '',
  lastCommit: {
    id: '',
    url: '',
    message: '',
    updatedAt: '',
    author: '',
  },
  tree_url: '',
  blamePath: '',
  commitsPath: '',
  permalink: '',
  rawPath: '',
  binary: false,
  html: '',
  raw: '',
  content: '',
  parentTreeUrl: '',
  renderError: false,
  base64: false,
  editorRow: 1,
  editorColumn: 1,
  fileLanguage: '',
  eol: '',
});

export const decorateData = (entity) => {
  const {
    id,
    projectId,
    branchId,
    type,
    url,
    name,
    icon,
    tree_url,
    path,
    renderError,
    content = '',
    tempFile = false,
    active = false,
    opened = false,
    changed = false,
    parentTreeUrl = '',
    level = 0,
    base64 = false,
  } = entity;

  return {
    ...dataStructure(),
    id,
    projectId,
    branchId,
    key: `${name}-${type}-${id}`,
    type,
    name,
    url,
    tree_url,
    path,
    level,
    tempFile,
    icon: `fa-${icon}`,
    opened,
    active,
    parentTreeUrl,
    changed,
    renderError,
    content,
    base64,
  };
};

export const getTree = state => (namespace, projectId, branch) => state.trees[`${namespace}/${projectId}/${branch}`];

export const getTreeEntry = (store, treeId, path) => {
  const fileList = store.getters.treeList(treeId);
  return fileList.find(file => file.path === path);
};

export const findEntry = (tree, type, name) => tree.find(
  f => f.type === type && f.name === name,
);

export const findIndexOfFile = (state, file) => state.findIndex(f => f.path === file.path);

export const setPageTitle = (title) => {
  document.title = title;
};

export const createTemp = ({
  projectId, branchId, name, path, type, level, changed, content, base64, url,
}) => {
  const treePath = path ? `${path}/${name}` : name;

  return decorateData({
    id: new Date().getTime().toString(),
    projectId,
    branchId,
    name,
    type,
    tempFile: true,
    path: treePath,
    icon: type === 'tree' ? 'folder' : 'file-text-o',
    changed,
    content,
    parentTreeUrl: '',
    level,
    base64,
    renderError: base64,
    url,
  });
};

export const createOrMergeEntry = ({ tree,
                                     projectId,
                                     branchId,
                                     entry,
                                     type,
                                     parentTreeUrl,
                                     level }) => {
  const found = findEntry(tree.tree || tree, type, entry.name);

  if (found) {
    return Object.assign({}, found, {
      id: entry.id,
      url: entry.url,
      tempFile: false,
    });
  }

  return decorateData({
    ...entry,
    projectId,
    branchId,
    type,
    parentTreeUrl,
    level,
  });
};
