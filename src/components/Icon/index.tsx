import { createFromIconfontCN } from '@ant-design/icons';
import { Tooltip, TooltipProps } from 'antd';

const Icon = createFromIconfontCN({
  // scriptUrl: '//at.alicdn.com/t/font_2762214_r1pldv49db.js', // 在 iconfont.cn 上生成
  scriptUrl: '//at.alicdn.com/t/c/font_2762214_7wx3spfijmt.js'
});


type IssueTooltipProps = Partial<TooltipProps> & {
    type?: string;
    title?: string;
};

export const IssueTooltip = ({type, title, ...rest}: IssueTooltipProps) => <Tooltip title={title} {...rest}><Icon type={type || 'icon-ziyuan'} /></Tooltip>

export default Icon
