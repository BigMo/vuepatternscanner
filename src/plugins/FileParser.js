class Parser {
    get name() { }
    getSegments(buffer) {
        throw new Error('Not implemented.')
    }
}

class BinaryParser extends Parser {
    get name() { return 'Raw Binary' }
    getSegments(buffer) {
        return [
            {
                name: 'Whole file',
                start: 0,
                end: buffer.byteLength
            }
        ]
    }
}

class BetterView {
    constructor(buffer) {
        this.buffer = buffer
        this.view = new DataView(buffer)
    }

    readBytes(at, length) {
        var _slice = this.buffer.slice(at, at + length)
        return new Uint8Array(_slice)
    }

    readUint64(at) {
        return this.view.getBigUint64(at, true) //return new BigUint64Array(this.buffer, at, 8)[0]
    }

    readInt64(at) {
        return this.view.getBigInt64(at, true) //return BigInt64Array.from(this.buffer.slice(at, at + 8))[0]
    }

    readUint32(at) {
        return this.view.getUint32(at, true) //return Uint32Array.from(this.buffer.slice(at, at + 4))[0]
    }

    readInt32(at) {
        return this.view.getInt32(at, true) //return Int32Array.from(this.buffer.slice(at, at + 4))[0]
    }

    readUint16(at) {
        return this.view.getUint16(at, true) // return Int16Array.from(this.buffer.slice(at, at + 2))[0]
    }

    readInt16(at) {
        return this.view.getInt16(at, true) // return Int16Array.from(this.buffer.slice(at, at + 2))[0]
    }

    readUint8(at) {
        return this.view.getUint8(at, true) // return Uint32Array.from(this.buffer.slice(at, at + 1))[0]
    }

    readInt8(at) {
        return this.view.getInt8(at, true) // return Int32Array.from(this.buffer.slice(at, at + 1))[0]
    }
}

class TypeBuilder {
    constructor() {
        this.obj = {}
        this.offset = 0
    }

    add(name, format, size) {
        this.obj[name] = {
            format: format,
            offset: this.offset
        }
        this.offset += size
        return this
    }

    uint64(name) {
        return this.add(name, 'uint64_t', 8)
    }
    int64(name) {
        return this.add(name, 'int64_t', 8)
    }
    uint32(name) {
        return this.add(name, 'uint32_t', 4)
    }
    int32(name) {
        return this.add(name, 'int32_t', 4)
    }
    uint16(name) {
        return this.add(name, 'uint16_t', 2)
    }
    int16(name) {
        return this.add(name, 'int16_t', 2)
    }
    uint8(name) {
        return this.add(name, 'uint8_t', 1)
    }
    int8(name) {
        return this.add(name, 'int8_t', 1)
    }
    build() {
        this.obj._size = this.offset
        return this.obj
    }
    cstr(name, length) {
        this.obj[name] = {
            format: 'cstr',
            offset: this.offset,
            length: length
        }
        this.offset += length
        return this
    }
}

class TypeReader {
    static read(view, type, offset = 0) {
        var ret = {}
        for (var field in type) {
            if (field.startsWith('_')) {
                ret[field] = type[field]
                continue
            }
            var desc = type[field]
            var value = 0
            switch (desc.format) {
                case 'cstr':
                    var bytes = view.readBytes(offset + desc.offset, desc.length)
                    var idx = bytes.findIndex(b => b == 0)
                    if (idx != -1) bytes = bytes.slice(0, idx)
                    value = bytes.reduce((str, b) => str + String.fromCharCode(b), '')
                    break;
                case 'uint64_t':
                    value = view.readUint64(offset + desc.offset)
                    break;
                case 'int64_t':
                    value = view.readInt64(offset + desc.offset)
                    break;
                case 'uint32_t':
                    value = view.readUint32(offset + desc.offset)
                    break;
                case 'int32_t':
                    value = view.readInt32(offset + desc.offset)
                    break;
                case 'uint16_t':
                    value = view.readUint16(offset + desc.offset)
                    break;
                case 'int16_t':
                    value = view.readInt16(offset + desc.offset)
                    break;
                case 'uint8_t':
                    value = view.readUint8(offset + desc.offset)
                    break;
                case 'int8_t':
                    value = view.readInt8(offset + desc.offset)
                    break;
            }
            ret[field] = value
        }
        return ret;
    }
}

const IMAGE_DOS_HEADER = new TypeBuilder()
    .uint16('e_magic')						// Magic number
    .uint16('e_cblp')						// Bytes on last page of file
    .uint16('e_cp')							// Pages in file
    .uint16('e_crlc')						// Relocations
    .uint16('e_cparhdr')					// Size of header in paragraphs
    .uint16('e_minalloc')					// Minimum extra paragraphs needed
    .uint16('e_maxalloc')					// Maximum extra paragraphs needed
    .uint16('e_ss')							// Initial (relative) SS value
    .uint16('e_sp')							// Initial SP value
    .uint16('e_csum')						// Checksum
    .uint16('e_ip')							// Initial IP value
    .uint16('e_cs')							// Initial (relative) CS value
    .uint16('e_lfarlc')						// File address of relocation table
    .uint16('e_ovno')						// Overlay number
    .uint16('e_res_0')		// reserved words
    .uint16('e_res_1')		// reserved words
    .uint16('e_res_2')		// reserved words
    .uint16('e_res_3')		// reserved words
    .uint16('e_oemid')						// OEM identifier (for e_oeminfo)
    .uint16('e_oeminfo')					// OEM information; e_oemid specific
    .uint16('e_res2_0')	// reserved words
    .uint16('e_res2_1')	// reserved words
    .uint16('e_res2_2')	// reserved words
    .uint16('e_res2_3')	// reserved words
    .uint16('e_res2_4')	// reserved words
    .uint16('e_res2_5')	// reserved words
    .uint16('e_res2_6')	// reserved words
    .uint16('e_res2_7')	// reserved words
    .uint16('e_res2_8')	// reserved words
    .uint16('e_res2_9')	// reserved words
    .uint32('e_lfanew')						// File address of new exe header
    .build()


const IMAGE_FILE_HEADER = new TypeBuilder()
    .uint32('Magic')
    .uint16('Machine')
    .uint16('NumberOfSections')
    .uint32('TimeDateStamp')
    .uint32('PointerToSymbolTable')
    .uint32('NumberOfSymbols')
    .uint16('SizeOfOptionalHeader')
    .uint16('Characteristics')
    .build()

const IMAGE_OPTIONAL_HEADER64 = new TypeBuilder()
    .uint16('Magic')
    .uint8('MajorLinkerVersion')
    .uint8('MinorLinkerVersion')
    .int32('SizeOfCode')
    .int32('SizeOfInitializedData')
    .int32('SizeOfUninitializedData')
    .int32('AddressOfEntryPoint')
    .int32('BaseOfCode')
    .uint64('ImageBase')
    .int32('SectionAlignment')
    .int32('FileAlignment')
    .uint16('MajorOperatingSystemVersion')
    .uint16('MinorOperatingSystemVersion')
    .uint16('MajorImageVersion')
    .uint16('MinorImageVersion')
    .uint16('MajorSubsystemVersion')
    .uint16('MinorSubsystemVersion')
    .int32('Win32VersionValue')
    .int32('SizeOfImage')
    .int32('SizeOfHeaders')
    .int32('CheckSum')
    .uint16('Subsystem')
    .uint16('DllCharacteristics')
    .uint64('SizeOfStackReserve')
    .uint64('SizeOfStackCommit')
    .uint64('SizeOfHeapReserve')
    .uint64('SizeOfHeapCommit')
    .int32('LoaderFlags')
    .int32('NumberOfRvaAndSizes')
    .build()

const IMAGE_OPTIONAL_HEADER32 = new TypeBuilder()
    .uint16('Magic')
    .uint8('MajorLinkerVersion')
    .uint8('MinorLinkerVersion')
    .int32('SizeOfCode')
    .int32('SizeOfInitializedData')
    .int32('SizeOfUninitializedData')
    .int32('AddressOfEntryPoint')
    .int32('BaseOfCode')
    .int32('BaseOfData')
    .int32('ImageBase')
    .int32('SectionAlignment')
    .int32('FileAlignment')
    .uint16('MajorOperatingSystemVersion')
    .uint16('MinorOperatingSystemVersion')
    .uint16('MajorImageVersion')
    .uint16('MinorImageVersion')
    .uint16('MajorSubsystemVersion')
    .uint16('MinorSubsystemVersion')
    .int32('Win32VersionValue')
    .int32('SizeOfImage')
    .int32('SizeOfHeaders')
    .int32('CheckSum')
    .uint16('Subsystem')
    .uint16('DllCharacteristics')
    .int32('SizeOfStackReserve')
    .int32('SizeOfStackCommit')
    .int32('SizeOfHeapReserve')
    .int32('SizeOfHeapCommit')
    .int32('LoaderFlags')
    .int32('NumberOfRvaAndSizes')
    .build();

const IMAGE_SECTION_HEADER = new TypeBuilder()
    .cstr('Name', 8)
    .uint32('VirtualSize')
    .uint32('VirtualAddress')
    .uint32('SizeOfRawData')
    .uint32('PointerToRawData')
    .uint32('PointerToRelocations')
    .uint32('PointerToLinenumbers')
    .uint16('NumberOfRelocations')
    .uint16('NumberOfLinenumbers')
    .uint32('Characteristics')
    .build()

class PEParser extends Parser {
    get name() { return 'Portable Executable' }
    getSegments(buffer) {
        var view = new BetterView(buffer)
        var pos = 0
        var dos = TypeReader.read(view, IMAGE_DOS_HEADER, pos)
        // Check 'MZ'
        if (dos.e_magic != 0x5A4D) {
            return []
        }

        //Check 'PE'
        pos = dos.e_lfanew
        var pe = TypeReader.read(view, IMAGE_FILE_HEADER, pos)
        if (pe.Magic != 0x4550) {
            return []
        }
        pos += pe._size
        var is32Bit = (pe.Characteristics & 0x0100) == 0x0100

        //Check opt header magic
        var expectedMagic = is32Bit ? 0x10b : 0x20b
        var optionalHeader = TypeReader.read(view, is32Bit ? IMAGE_OPTIONAL_HEADER32 : IMAGE_OPTIONAL_HEADER64, pos)
        if (expectedMagic != optionalHeader.Magic) {
            return []
        }
        pos += optionalHeader._size + 128 //Why is it 128 bytes short at this point? The optional header likely is incomplete

        var sections = []
        for (var i = 0; i < pe.NumberOfSections; i++) {
            var section = TypeReader.read(view, IMAGE_SECTION_HEADER, pos);
            sections.push(section)
            pos += section._size;
        }
        var segments = sections.map(s => {
            return {
                name: `Section "${s.Name}"`,
                start: s.PointerToRawData,
                end: s.PointerToRawData + s.SizeOfRawData
            }
        });
        segments.push({
            name: 'Whole file',
            start: 0,
            end: buffer.byteLength
        })
        return segments;
    }
}

module.exports.PEParser = PEParser
module.exports.PARSERS = [new BinaryParser(), new PEParser()]