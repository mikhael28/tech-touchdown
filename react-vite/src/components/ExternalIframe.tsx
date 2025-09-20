import { useEffect, useState } from "react";

export default function ExternalSiteModal(props: any) {
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(false);

  // TODO could build a proxy to scrape foreign sites, grab the html, and display them here in the iframe to get around cross origin stuff.

  // The iFrame checking solution was found on StackOverflow, the solution was not possible on the client-Side.
  // A helpful developer posted a Cloudflare worker he developed to check the http headers of the website in question, and return false/true if we could watch
  // They asked not to use their solution in production, but I have included it here as a temporary fix.
  // The gist to deploy it ourselves is here: The code is available at: https://gist.github.com/repalash/b1e778dbe3ac2e7149831c530a6535f9 and can be deployed directly as a cloudflare worker

  function checkUrlFrameOptions(siteUrl: string) {
    return fetch(
      `https://header-inspector.repalash.workers.dev/?${new URLSearchParams({
        apiurl: siteUrl,
        headers: "x-frame-options",
      })}`,
      {
        method: "GET",
      },
    )
      .then((r) => r.json())
      .then((json) => {
        let xFrameOp = (json.headers["x-frame-options"] || "").toLowerCase();
        // deny all requests
        if (xFrameOp === "deny") return false;
        if (xFrameOp.includes("allow-from")) return false;
        // deny if different origin
        // eslint-disable-next-line no-restricted-globals
        if (xFrameOp === "sameorigin" && json.origin !== location.origin)
          return false;
        return true;
      })
      .catch((e) => console.log("Cloudflare error: ", e));
  }
  useEffect(() => {
    if (props.url !== "" || props.url !== "https://example.com/") {
      checkUrlFrameOptions(props.url).then((res) => {
        // console.log(`${props.url} can be loaded in iframe: `, res);
        if (res === true) {
          setLoading(false);
          setRender(true);
        } else if (res === false) {
          setLoading(false);
          setRender(false);
        }
      });
    }
  }, [props.url]);

  return (
    <div className="items-center justify-center">
      {loading === true ? (
        <div
          style={{
            width: 600,
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Loading</p>
        </div>
      ) : (
        <>
          {render === false ? (
            <div
              style={{
                width: 600,
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p>This page is not available to view in an iFrame</p>
            </div>
          ) : (
            <iframe
              id="inlineFrameExample"
              title="Inline Frame Example"
              width={`${window.innerWidth * 0.9}px`}
              height={`${window.innerHeight * 0.8}px`}
              src={props.url}
            />
          )}
        </>
      )}
    </div>
  );
}
