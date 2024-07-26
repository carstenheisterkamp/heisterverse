import { ReactThreeFiber } from "@react-three/fiber/dist/declarations/src";
import { BufferAttribute } from "three";

// global.d.ts (or any other .d.ts file)
declare module 'react-three-fiber' {
    namespace JSX {
        interface IntrinsicElements {
            bufferAttribute: ReactThreeFiber.Node<BufferAttribute, typeof BufferAttribute>;
        }
    }
}
