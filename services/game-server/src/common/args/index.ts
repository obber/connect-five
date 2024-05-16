import commandLineArgs, {
  CommandLineOptions,
  OptionDefinition,
} from "command-line-args";

const CLI_ARGS_DEFINITION: OptionDefinition[] = [
  { name: "gen_api_client", type: Boolean },
  { name: "local", type: Boolean },
];

interface Args extends CommandLineOptions {
  gen_api_client?: boolean;
  local?: boolean;
}

export const args: Args = commandLineArgs(CLI_ARGS_DEFINITION);
