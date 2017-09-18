namespace dragonBones {
    /**
     * @internal
     * @private 
     */
    export declare const webAssemblyModule: {
        HEAP16: Int16Array;
        _malloc(byteSize: number): number;
        _free(pointer: number): void;

        // DragonBones embinding.
        setDataBinary(data: DragonBonesData, binaryPointer: number, intBytesLength: number, floatBytesLength: number, frameIntBytesLength: number, frameFloatBytesLength: number, frameBytesLength: number, timelineBytesLength: number): void;
    };
}