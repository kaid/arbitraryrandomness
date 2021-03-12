type Char = string;
type Decimal = number;
type NextArgs<I, O, C> = (input: I, accumulation: O, context?: C) => {
    input: I,
    accumulation: O,
};

class RecursiveIterator<I, O, C=unknown> {
    private context?: C;
    private next: NextArgs<I, O, C>;
    private shouldReturn: (i: I) => boolean;
    private initializeAccumulation: () => O;

    constructor(params: {
        context?: C,
        next: NextArgs<I, O, C>;
        shouldReturn: (i: I) => boolean,
        initializeAccumulation: () => O,
    }) {
        this.next = params.next;
        this.context = params.context;
        this.shouldReturn = params.shouldReturn;
        this.initializeAccumulation = params.initializeAccumulation;
    }

    private recursion(input: I, accumulation: O) {
        if (this.shouldReturn(input)) {
            return accumulation;
        }

        const nextArgs = this.next(input, accumulation, this.context);
        return this.recursion(nextArgs.input, nextArgs.accumulation);
    }

    public iterate(input: I): O {
        return this.recursion(input, this.initializeAccumulation());
    }
}

type EncoderContext = { base: number, encode: (n: Decimal) => Char };
type DecoderContext = { base: number, decode: (c: Char) => Decimal };

class DecimalConverter {
    constructor(
        private encodeIterator: RecursiveIterator<Decimal, string, EncoderContext>,
        private decodeIterator: RecursiveIterator<string, Decimal, DecoderContext>,
    ) {
    }

    public decode(input: string): Decimal {
        return this.decodeIterator.iterate(input);
    }

    public encode(input: Decimal): string {
        return this.encodeIterator.iterate(input);
    }
}

const EXCEL_COLUMN_BASE = 26;
const EXCEL_COLUMN_CHAR_CODE_OFFSET = 'A'.charCodeAt(0) - 1;

const excelColumnDecimalConverter = new DecimalConverter(
    new RecursiveIterator({
        shouldReturn: i => i === 0,
        initializeAccumulation: () => '',
        context: {
            base: EXCEL_COLUMN_BASE,
            encode: n => String.fromCharCode(n + EXCEL_COLUMN_CHAR_CODE_OFFSET),
        },
        next: (i, a, c) => ({
            input: Math.floor(i / c.base),
            accumulation: c.encode(i % c.base) + a,
        }),
    }),
    new RecursiveIterator({
        initializeAccumulation: () => 0,
        shouldReturn: i => i.length === 0,
        context: {
            base: EXCEL_COLUMN_BASE,
            decode: c => c.charCodeAt(0) - EXCEL_COLUMN_CHAR_CODE_OFFSET,
        },
        next: (i, a, c) => ({
            input: i.slice(1, i.length),
            accumulation: a * c.base + c.decode(i[0]),
        }),
    }),
);
