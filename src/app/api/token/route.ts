// // /src/app/api/token/route.ts
// import { withIronSession } from "next-iron-session";

// export const GET = withIronSession(async (req: any, res: any) => {
//     const token = req.session.get("token");
//     if (token) {
//         res.json({ token });
//     } else {
//         res.json({});
//     }
// }, {
//     password: process.env.SECRET_COOKIE_PASSWORD || "",
//     cookieName: "my-app-cookie",
//     cookieOptions: {
//         secure: process.env.IS_NODE_ENV === "production",
//     },
// });

// export const POST = withIronSession(async (req: any, res: any) => {
//     const { token } = req.body;
//     req.session.set("token", token);
//     await req.session.save();
//     res.json({ success: true });
// }, {
//     password: process.env.SECRET_COOKIE_PASSWORD || "",
//     cookieName: "my-app-cookie",
//     cookieOptions: {
//         secure: process.env.IS_NODE_ENV === "production",
//     },
// });
