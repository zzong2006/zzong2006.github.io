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
 * The default page frame - three-column layout with left sidebar, center
 * content (header + body + afterBody), and right sidebar, followed by a footer.
 *
 * This is the original Quartz layout, extracted from renderPage.tsx.
 */
export const DefaultFrame: PageFrame = {
  name: "default",
  render({
    componentData,
    header,
    beforeBody,
    pageBody: Content,
    afterBody,
    left,
    right,
    footer: Footer,
  }: PageFrameProps) {
    return (
      <>
        <div class="left sidebar">{renderComponents(left, componentData)}</div>
        <div class="center">
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
        <div class="right sidebar">{renderComponents(right, componentData)}</div>
        <Footer {...componentData} />
      </>
    )
  },
}
