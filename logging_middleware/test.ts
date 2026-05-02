import { Log } from "./index.ts";

async function test() {
  console.log("Sending test log...");
  await Log("frontend", "info", "middleware", "Logging middleware test successful");
  console.log("Done!");
}

test();