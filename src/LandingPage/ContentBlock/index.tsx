/**
 * it directs to left, right or up ContentBlock according to the id type it gets in the props
 */
import LeftContentBlock from "./LeftContentBlock";
import RightContentBlock from "./RightContentBlock";
import { ContentBlockProps } from "./types";
import UpContentBlock from "./UpContentBlock";

const ContentBlock = (props: ContentBlockProps) => {
  if (props.type === "left") return <LeftContentBlock {...props} />;
  if (props.type === "right") return <RightContentBlock {...props} />;
  if (props.type === "up") return <UpContentBlock {...props} />;

  return null;
};

export default ContentBlock;
