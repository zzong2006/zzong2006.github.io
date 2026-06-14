import { PageFrame, PageFrameProps } from "./types"
import HeaderConstructor from "../Header"
import { QuartzComponent, QuartzComponentProps } from "../types"

const Header = HeaderConstructor()

function renderComponents(components: QuartzComponent[], componentData: QuartzComponentProps) {
  return components
    .filter((Component): Component is QuartzComponent => typeof Component === "function")
    .map((Component) => <Component {...componentData} />)
}

/**
 * Full-width page frame - no sidebars. The center content area spans the
 * full width of the page. Header, beforeBody, body, afterBody, and footer
 * are all rendered in a single column.
 *
 * Useful for page types like Canvas, presentations, or dashboards that
 * need maximum horizontal space.
 */
export const FullWidthFrame: PageFrame = {
  name: "full-width",
  render({
    componentData,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    footer: Footer,
  }: PageFrameProps) {
    return (
      <>
        <div class="center full-width">
          <div class="page-header">
            <Header {...componentData}>{renderComponents(header, componentData)}</Header>
            <div class="popover-hint">
              {renderComponents(beforeBody, componentData)}
            </div>
          </div>
          <Content {...componentData} />
          <hr />
          <div class="page-footer">{renderComponents(afterBody, componentData)}</div>
        </div>
        <Footer {...componentData} />
      </>
    )
  },
}
