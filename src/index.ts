import {ProjectBuilder} from "engine/ProjectBuilder";
import {TypescriptExpressRestBackendProject} from "backend/TypescriptExpressRestBackendProject";
import {Command} from "commander";
import {GeneratorXmlInterpreter} from "xmlInterpreter/GeneratorXmlInterpreter";

export class Generator {

  constructor(readonly xmlFile: string) {
    this.registerEngines();
  }

  registerEngines() {
    ProjectBuilder.getInstance().registerEngine(`typescriptExpressRestBackend`, new TypescriptExpressRestBackendProject());
  }

  async generate(): Promise<void> {
    await GeneratorXmlInterpreter.interpret(this.xmlFile);
  }
}

const program = new Command();
program
  .name("modular-source-generator")
  .description("Modular Source Generator")
  .version("1.0.0");

program.option("-f --descriptor-xml <xml>", "Program descriptor xml file");
program.parse(process.argv);
const options = program.opts();
new Generator(options.descriptor_xml).generate().catch((error) => console.error(error));
