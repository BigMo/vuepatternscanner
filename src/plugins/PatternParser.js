class Parser {
    get name() { }
    parse(string) {
        throw new Error('Not implemented.')
    }
}

class ParseResult {
    constructor(input, rows) {
        this.input = input
        this.rows = rows
    }
}

/*
        105cb1b4 6A 00           PUSH       0x0
        105cb1b6 50              PUSH       EAX
        105cb1b7 E8 04 23        CALL       Component_get_transform                          Transform * Component_get_transf
                 E4 FF
        105cb1bc 8B 0D 04        MOV        ECX,dword ptr [EPOHLHBOHHE__TypeInfo]            = NaP
                 C1 43 11
        105cb1c2 83 C4 08        ADD        ESP,0x8
*/

class HexParser extends Parser {
    get name() { return 'HexDump' }
    parse(input) {
        var lines = input.split('\n')
        var rows = []
        for (var l in lines) {
            var line = lines[l]
            var hexStrings = line.match(/([0-9A-Fa-f]{2})/gm)
            if (!hexStrings) continue;
            var bytes = hexStrings.map(hs => parseInt(hs, 16))
            rows.push({
                comment: '',
                bytes: bytes
            })
        }
        return new ParseResult(input, rows)
    }
}

class GhidraParser extends Parser {
    get name() { return 'Ghidra Disassembly' }
    parse(input) {
        const GHIDRA = new RegExp('(?<address>[0-9A-Fa-f]{8,16})(?<bytes1>( ([0-9A-Fa-f]{2}))+)\s*(?<comment>[^\n]+)|(?<bytes2>( ([0-9A-Fa-f]{2}))+)\n', 'gm')
        var rows = []
        for (var match of input.matchAll(GHIDRA)) {
            var bytesstr = ''
            var comment = ''
            if (match.groups.bytes1) {
                bytesstr = match.groups.bytes1
                comment = match.groups.comment.replace(/\s+/gi, ' ').trim()
            } else if (match.groups.bytes2)
                bytesstr = match.groups.bytes2
            else
                continue;
            bytesstr = bytesstr.trim()
            var hexStrings = bytesstr.split(/\s+/)
            var bytes = hexStrings.map(hs => parseInt(hs, 16))
            rows.push({
                comment: comment,
                bytes: bytes
            })
        }
        return new ParseResult(input, rows)
    }
}

class CEParser extends Parser {
    get name() { return 'CheatEngine Disassembly' }
    parse(input) {
        const CE = new RegExp('(?<address>[^-]+)-(?<bytes>[^-]+)-(?<comment>[^\n]+)', 'gm')
        var rows = []
        for (var match of input.matchAll(CE)) {
            var bytesstr = match.groups.bytes.trim().replace(/\s+/gi, '')
            var comment = match.groups.comment.replace(/\s+/gi, ' ').trim()
            var hexStrings = []
            for (var m of bytesstr.matchAll(/[0-9A-Fa-f]{2}/gm)) hexStrings.push(m)
            var bytes = hexStrings.map(hs => parseInt(hs, 16))
            rows.push({
                comment: comment,
                bytes: bytes
            })
        }
        return new ParseResult(input, rows)
    }
}

class IDAParser extends Parser {
    get name() { return 'IDA Disassembly' }
    parse(input) {
        const CE = new RegExp('(?<address>\.[^:]*:[0-9A-Fa-f]+)(?<bytes>( [0-9A-Fa-f]{2})+)\s*(?<comment>[^\n]+)', 'g')
        var rows = []
        for (var match of input.matchAll(CE)) {
            var bytesstr = match.groups.bytes.trim().replace(/\s+/gi, '')
            var comment = match.groups.comment.replace(/\s+/gi, ' ').trim()
            var hexStrings = []
            for (var m of bytesstr.matchAll(/[0-9A-Fa-f]{2}/gm)) hexStrings.push(m)
            var bytes = hexStrings.map(hs => parseInt(hs, 16))
            rows.push({
                comment: comment,
                bytes: bytes
            })
        }
        return new ParseResult(input, rows)
    }
}

module.exports.HexParser = HexParser
module.exports.IDAParser = IDAParser
module.exports.PARSERS = [new HexParser(), new GhidraParser(), new CEParser(), new IDAParser()]