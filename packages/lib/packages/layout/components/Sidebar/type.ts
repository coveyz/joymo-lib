export type childrenType = {
  path?: string;
  noShowingChildren?: boolean;
  children?: childrenType;
  value: unknown;
  meta?: {
    icon?: string;
    hidden?: boolean; // 
    title?: string;
    showParent?: boolean;
    alwaysShow?: boolean;
    extraIcon?: {
      svg?: boolean;
      name?: string;
    };
  }
  showTooltip?: boolean;
  parentId?: number;
  pathList?: number[];
}

