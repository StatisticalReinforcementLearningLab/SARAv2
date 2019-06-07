import { BuilderContext } from "@angular-devkit/architect";
import { FirebaseTools } from "../interfaces";
export default function deploy(firebaseTools: FirebaseTools, context: BuilderContext, projectRoot: string, firebaseProject?: string): Promise<void>;
