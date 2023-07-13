//@ts-ignore
import BrickParentView from './src/index.vue'
import { withInstall } from '@coveyz/utils';

export const ParentView = withInstall(BrickParentView);
export default BrickParentView;