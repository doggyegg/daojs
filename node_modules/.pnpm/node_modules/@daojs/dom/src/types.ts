export type Props = Record<string, any> & { children?: any };

export type VNode = {
  type: any;
  props: Props | null;
  key?: any;
};

export type Component<P = any> = (props: P) => any;
