function formatHex(num, places) {
    var str = num.toString(16).toUpperCase();
    return "0".repeat(places - str.length) + str;
}

class Project {
    constructor(name, groups) {
        this.name = name ?? '';
        this.groups = groups ?? []
    }

    static newProject() {
        var g1 = new Group('Demo Group #1', [
            new Pattern('Demo Pattern #1', [
                PatternRow.fromBytes([0xE9, 0x17, 0xFF, 0xFF, 0xFF], 'JMP LAB_105cb0c0'),
                PatternRow.fromBytes([0x8B, 0x46, 0x34], 'MOV EAX, dword ptr[ESI + 0x34]'),
                PatternRow.fromBytes([0x85, 0xC0], 'TEST EAX, EAX'),
                PatternRow.fromBytes([0xF, 0x84, 0x0A, 0x01, 0x00, 0x00], 'JZ LAB_105cb2be')
            ]),
            new Pattern('Demo Pattern #2', [
                PatternRow.fromBytes([0x6A, 0x00], 'PUSH 0x0'),
                PatternRow.fromBytes([0x50], 'PUSH EAX'),
                PatternRow.fromBytes([0xE8, 0x04, 0x23, 0xE4, 0xFF], 'CALL Component_get_transform'),
                PatternRow.fromBytes([0x8B, 0x0d, 0x04, 0xc1, 0x43, 0x11], 'MOV ECX, dword ptr [EPOHLHBOHHE__TypeInfo]')
            ])
        ]);
        var g2 = new Group('Demo Group #2', [
            new Pattern('Demo Pattern #1', [
                PatternRow.fromBytes([0xE9, 0x17, 0xFF, 0xFF, 0xFF], 'JMP LAB_105cb0c0'),
                PatternRow.fromBytes([0x8B, 0x46, 0x34], 'MOV EAX, dword ptr[ESI + 0x34]'),
                PatternRow.fromBytes([0x85, 0xC0], 'TEST EAX, EAX'),
                PatternRow.fromBytes([0xF, 0x84, 0x0A, 0x01, 0x00, 0x00], 'JZ LAB_105cb2be')
            ]),
            new Pattern('Demo Pattern #2', [
                PatternRow.fromBytes([0x6A, 0x00], 'PUSH 0x0'),
                PatternRow.fromBytes([0x50], 'PUSH EAX'),
                PatternRow.fromBytes([0xE8, 0x04, 0x23, 0xE4, 0xFF], 'CALL Component_get_transform'),
                PatternRow.fromBytes([0x8B, 0x0d, 0x04, 0xc1, 0x43, 0x11], 'MOV ECX, dword ptr [EPOHLHBOHHE__TypeInfo]')
            ])
        ]);
        return new Project('New Project', [g1, g2]);
    }

    get firstPattern() {
        for (var group of this.groups)
            for (var pattern of group.patterns)
                if (pattern) return pattern;
        return null;
    }

    hasGroupOfName(name) {
        return this.groups.filter(g => g.name == name).length > 0;
    }
}

class Group {
    constructor(name, patterns) {
        this.name = name ?? '';
        this.patterns = patterns ?? [];
    }

    get firstPattern() {
        for (var pattern of patterns)
            if (pattern) return pattern;
        return null;
    }

    hasPatternOfName(name) {
        return this.patterns.filter(p => p.name == name).length > 0;
    }
}

class Pattern {
    constructor(name, rows) {
        this.name = name ?? '';
        this.rows = rows ?? [];
    }

    get bytesArray() {
        return [].concat.apply([], this.rows.map(r => r.bytesArray))
    }

    get hexString() {
        return this.rows.map(r => r.hexString).join(" ")
    }

    get maskString() {
        return this.rows.map(r => r.maskString).join("")
    }

    get patternString() {
        return this.rows.map(r => r.patternString).join(" ")
    }
}

class PatternRow {
    constructor(comment, bytes) {
        this.comment = comment ?? '';
        this.bytes = bytes ?? [];
    }

    static fromBytes(bytes, comment) {
        var row = new PatternRow();
        row.comment = comment;
        row.bytes = bytes.map(b => new PatternByte(b, false))
        return row
    }

    get bytesArray() {
        return this.bytes.map(b => b.value)
    }

    get hexString() {
        return this.bytes.map(b => b.hexString).join(" ")
    }

    get maskString() {
        return this.bytes.map(b => b.maskString).join("")
    }

    get patternString() {
        return this.bytes.map(b => b.patternString).join(" ")
    }
}

class PatternByte {
    constructor(value, wildcard) {
        this.value = value ?? 0x00;
        this.wildcard = wildcard ?? false;
    }

    toString() {
        if (this.wildcard)
            return '??';
        else
            return this.hexString
    }

    get patternString() {
        return this.wildcard ? '??' : this.hexString
    }

    get maskString() {
        return this.wildcard ? '?' : 'x'
    }

    get hexString() {
        return formatHex(this.value, 2)
    }
}

module.exports.formatHex = formatHex;
module.exports.Project = Project;
module.exports.Group = Group;
module.exports.Pattern = Pattern;
module.exports.PatternRow = PatternRow;
module.exports.PatternByte = PatternByte;