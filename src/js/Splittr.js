
export default class Splittr {
    constructor(options) {
        Object.assign(this, options);

        this.input.onkeydown = this.onKeyDown.bind(this);
        this.initialize();
    }

    addValidationRule(rule) {
        Object.assign(this.is, rule);
    }

    buildValidationObj() {
        this.is = {
            n: {
                valid: c => c.match(/^[0-9]+$/),
                type: 'number'
            },
            L: {
                valid: c => c.match(/^[A-Z]+$/),
                type: 'uppercase letter'
            },
            l: {
                valid: c => c.match(/^[a-z]+$/),
                type: 'lowercase letter'
            },
            w: {
                valid: c => c.match(/[$-/:-?{-~!"^_`\[\]]/), // eslint-disable-line
                type: 'symbol'
            },
            d: {
                valid: c => c.match(`${this.delimiter}`),
                type: 'delimiter'
            }
        };

        this.input.maxLength = this.pattern.length;

        return this;
    }

    buildAllowedAction() {
        this.allowed = [8];

        return this;
    }

    buildValidationArr() {
        this.checkSlot = [];

        for (let i = 0; i < this.pattern.length; i += 1) {
            const partial = this.pattern[i];

            if (partial === this.delimiter) {
                this.checkSlot.push(this.is.d);
                continue;
            }
            if (Object.keys(this.is).indexOf(partial) === -1) {
                return this.handleError('Invalid pattern rule')
            }
            this.checkSlot.push(this.is[partial]);
        }

        return this;
    }

    setPosition() {
        const selecting = this.pos.start !== this.pos.end;
        const notInRange = this.pos.start < this.input.value.length;

        if (selecting) {
            this.pos.start = this.pos.end;
        }

        if (this.code === 8) {
            this.pos.start -= 1;
            this.pos.end -= 1;

            return this;
        }

        if ((this.code === 37 || this.code === 39) || notInRange) {
            this.input.setSelectionRange(this.pattern.length + 2, this.pattern.length + 2);
            this.ev.preventDefault();
        }

        this.pos.start = Math.max(0, this.pos.start);
        this.pos.end = Math.max(0, this.pos.start);

        return this;
    }

    validateChar() {
        const allow = this.allowed.some(c => c === this.code);
        const val = this.input.value;
        const arrVal = this.input.value.split('');

        if (val.charAt(this.pos.start) === this.delimiter && this.code === 8) {
            this.pos.start -= 1;
            this.pos.end -= 1;

            arrVal.splice(this.pos.start, 1);
            this.input.value = arrVal.join('');
        }

        if (this.checkSlot[this.pos.start]) {
            if (!this.checkSlot[this.pos.start].valid(this.char) && !allow) {
                const err = this.checkSlot[this.pos.start].type;

                this.handleError(`Expected ${err}`);

                return this.ev.preventDefault();
            }
        }

        const next = this.checkSlot[this.pos.start + 1];
        const hasDelimiter = val.charAt(this.pos.start + 1).match(`${this.delimiter}`);

        if (next && next.type !== 'symbol') {
            if (next.valid(this.delimiter) && !allow && !hasDelimiter) {
                this.input.value += `${this.char}${this.delimiter}`;
                this.pos.start += 1;
                this.pos.end += 1;

                return this.ev.preventDefault();
            }
        }
    }

    handleError(msg) {
        this.errCallback(msg);
    }

    onKeyDown(e) {
        this.ev = e;
        this.code = e.charCode || e.keyCode || e.which;
        this.char = e.key;
        this.pos = {
            start: Math.max(this.input.selectionStart, this.input.selectionEnd),
            end: Math.min(this.input.selectionStart, this.input.selectionEnd)
        };

        this
            .setPosition()
            .validateChar();
    }

    initialize() {
        this
            .buildValidationObj()
            .buildValidationArr()
            .buildAllowedAction();
    }
}
