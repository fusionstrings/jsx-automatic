import render from "preact-render-to-string";
import { typeByExtension } from "https://deno.land/std@0.150.0/media_types/mod.ts";
import { Home } from "./home.tsx";
import { NotFound } from "./404.tsx";
import { ServerError } from "./500.tsx";

function requestHandlerHome(request: Request) {
  return new Response(render(<Home />), {
    headers: { "content-type": typeByExtension("html") },
  });
}

type RequestHandler = {
  [pathname: URL["pathname"]]: (
    request: Request
  ) => Response | Promise<Response>;
};

const requestHandlers: RequestHandler = {
  "/": requestHandlerHome,
};

function requestHandler(request: Request) {
  try {
    const { pathname } = new URL(request.url);

    const requestHandler = requestHandlers[pathname];

    if (requestHandler) {
      return requestHandler(request);
    }

    return new Response(render(<NotFound path={pathname} />), {
      status: 404,
      headers: { "content-type": typeByExtension("html") },
    });
  } catch (error) {
    return new Response(
      render(<ServerError message={error.message || error.toString()} />),
      { status: 500, headers: { "content-type": typeByExtension("html") } }
    );
  }
}

export { requestHandler };
