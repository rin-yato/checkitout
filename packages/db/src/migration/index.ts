import { migrate } from "../utils/migration";

const success = await migrate();

// if migration fails, exit with code 1
if (!success) process.exit(1);

// if migration succeeds, exit with code 0
process.exit(0);
