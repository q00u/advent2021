// eslint-disable-next-line no-unused-vars
const input = '020D708041258C0B4C683E61F674A1401595CC3DE669AC4FB7BEFEE840182CDF033401296F44367F938371802D2CC9801A980021304609C431007239C2C860400F7C36B005E446A44662A2805925FF96CBCE0033C5736D13D9CFCDC001C89BF57505799C0D1802D2639801A900021105A3A43C1007A1EC368A72D86130057401782F25B9054B94B003013EDF34133218A00D4A6F1985624B331FE359C354F7EB64A8524027D4DEB785CA00D540010D8E9132270803F1CA1D416200FDAC01697DCEB43D9DC5F6B7239CCA7557200986C013912598FF0BE4DFCC012C0091E7EFFA6E44123CE74624FBA01001328C01C8FF06E0A9803D1FA3343E3007A1641684C600B47DE009024ED7DD9564ED7DD940C017A00AF26654F76B5C62C65295B1B4ED8C1804DD979E2B13A97029CFCB3F1F96F28CE43318560F8400E2CAA5D80270FA1C90099D3D41BE00DD00010B893132108002131662342D91AFCA6330001073EA2E0054BC098804B5C00CC667B79727FF646267FA9E3971C96E71E8C00D911A9C738EC401A6CBEA33BC09B8015697BB7CD746E4A9FD4BB5613004BC01598EEE96EF755149B9A049D80480230C0041E514A51467D226E692801F049F73287F7AC29CB453E4B1FDE1F624100203368B3670200C46E93D13CAD11A6673B63A42600C00021119E304271006A30C3B844200E45F8A306C8037C9CA6FF850B004A459672B5C4E66A80090CC4F31E1D80193E60068801EC056498012804C58011BEC0414A00EF46005880162006800A3460073007B620070801E801073002B2C0055CEE9BC801DC9F5B913587D2C90600E4D93CE1A4DB51007E7399B066802339EEC65F519CF7632FAB900A45398C4A45B401AB8803506A2E4300004262AC13866401434D984CA4490ACA81CC0FB008B93764F9A8AE4F7ABED6B293330D46B7969998021C9EEF67C97BAC122822017C1C9FA0745B930D9C480';

// eslint-disable-next-line no-unused-vars
const test1 = ['8A004A801A8002F478', 16, '620080001611562C8802118E34', 12, 'C0015000016115A2E0802F182340', 23, 'A0016C880162017C3686B18A3D4780', 31];

// eslint-disable-next-line no-unused-vars
const test2 = ['C200B40A82', 3, '04005AC33890', 54, '880086C3E88112', 7, 'CE00C43D881120', 9, 'D8005AC2A8F0', 1, 'F600BC2D8F', 0, '9C005AC2F8F0', 0, '9C0141080250320F1802104A08', 1];

// let versum = 0;

class HexStream {
    constructor(hexInput) {
        this.hexInput = hexInput.split('');
        this.bitString = [];
    }

    nextHex() {
        const hex = this.hexInput.shift();
        // console.log('rawHex', hex);
        // const bits = parseInt(hex, 16).toString(2).padStart(4, '0').split('');
        // console.log('bits', bits);
        this.bitString.push(...parseInt(hex, 16).toString(2).padStart(4, '0').split(''));
    }

    nextBits(length = 1) {
        while (length > this.bitString.length) { this.nextHex(); }
        const bits = this.bitString.splice(0, length);
        return (length === 1) ? bits[0] : bits;
    }

    streamRemaining() {
        return this.hexInput.length * 4 + this.bitString.length;
    }

    getExact(length) {
        const subLength = this.nextBits(length).join('');
        // console.log('subLength', subLength);
        return (parseInt(subLength, 2));
    }

    getSubLength() {
        return this.getExact(15);
    }

    getSubPacks() {
        return this.getExact(11);
    }



    getHeader() {
        // Get header
        const version = parseInt(this.nextBits(3).join(''), 2);
        // versum += version;
        const typeId = parseInt(this.nextBits(3).join(''), 2);
        return [version, typeId];
    }

    getLiteral() {
        // Get numbers
        const digits = [];
        let controlBit = 0;
        do {
            controlBit = this.nextBits();
            // console.log('Control bit:', controlBit);
            const digit = this.nextBits(4);
            // console.log('digit', digit);
            digits.push(...digit);
        } while (controlBit === '1');
        // console.log('Remaining bits:', this.bitString);
        return parseInt(digits.join(''), 2);
    }

    getOperator() {
        const lengthType = this.nextBits();
        if (lengthType === '0') {
            const subLength = this.getSubLength();
            // console.log('Sub-length:', subLength);
            let newLength = 0;
            const packets = [];
            do {
                const [,, packet, l] = this.getPacket();
                packets.push(packet);
                newLength += l;
                // console.log('New length:', newLength);
            } while (newLength < subLength);
            return packets;
        }
        const subPacks = this.getSubPacks();
        // console.log('Sub-packs:', subPacks);
        const packets = [];
        for (let i = 0; i < subPacks; i++) {
            const thisPacket = this.getPacket();
            packets.push(thisPacket[2]);
        }
        return packets;
    }

    getPacket() {
        const startLength = this.streamRemaining();
        const [version, typeId] = this.getHeader();
        // console.log('Version:', version, 'Type:', typeId);
        switch (typeId) {
            case 0: // sum
            {
                const op = this.getOperator();
                // console.log('Operator:', op);
                return [version, typeId, op.reduce((a, b) => a + b, 0), startLength - this.streamRemaining()];
            }
            case 1: // product
            {
                const op = this.getOperator();
                return [version, typeId, op.reduce((a, b) => a * b, 1), startLength - this.streamRemaining()];
            }
            case 2: // min
            {
                const op = this.getOperator();
                return [version, typeId, Math.min(...op), startLength - this.streamRemaining()];
            }
            case 3: // max
            {
                const op = this.getOperator();
                return [version, typeId, Math.max(...op), startLength - this.streamRemaining()];
            }
            case 4: // literal
            {
                const literal = this.getLiteral();
                // console.log('Literal:', literal);
                const totalLength = startLength - this.streamRemaining();
                return [version, typeId, literal, totalLength];
            }
            case 5: // greater
            {
                const op = this.getOperator();
                const [a, b] = op;
                return [version, typeId, a > b ? 1 : 0, startLength - this.streamRemaining()];
            }
            case 6: // less
            {
                const op = this.getOperator();
                const [a, b] = op;
                return [version, typeId, a < b ? 1 : 0, startLength - this.streamRemaining()];
            }
            case 7: // equal
            {
                const op = this.getOperator();
                const [a, b] = op;
                return [version, typeId, a === b ? 1 : 0, startLength - this.streamRemaining()];
            }
            default:
            {
                // Part 1:
                // const lengthType = this.nextBits();
                // if (lengthType === '0') {
                //     const subLength = this.getSubLength();
                //     // console.log('Sub-length:', subLength);
                //     let newLength = 0;
                //     const packets = [];
                //     do {
                //         const [ver, type, packet, l] = this.getPacket();
                //         packets.push([ver, type, packet, l]);
                //         newLength += l;
                //         // console.log('New length:', newLength);
                //     } while (newLength < subLength);
                //     const totalLength = startLength - this.streamRemaining();
                //     return [version, typeId, packets, totalLength];
                // }
                // const subPacks = this.getSubPacks();
                // // console.log('Sub-packs:', subPacks);
                // const packets = [];
                // for (let i = 0; i < subPacks; i++) {
                //     const thisPacket = this.getPacket();
                //     packets.push(thisPacket);
                // }
                // const totalLength = startLength - this.streamRemaining();
                // return [version, typeId, packets, totalLength];
                console.log('Unknown type:', typeId);
                return [version, typeId];
            }
        }
    }
}


// Early testing:
// {
//     const hexStream = new HexStream('D2FE28');
//     const [version, typeId] = hexStream.getHeader();
//     console.log('Version:', version);
//     console.log('Type ID:', typeId);
//     const digits = hexStream.getLiteral();
//     console.log('Digits:', digits);
// }

// {
//     const hexStream = new HexStream('D2FE28');
//     const [version, typeId, packet, length] = hexStream.getPacket();
//     console.log('Version:', version);
//     console.log('Type ID:', typeId);
//     console.log('Packet:', packet);
//     console.log('Length:', length);
// }

// {
//     const hexStream = new HexStream('38006F45291200');
//     const packet = hexStream.getPacket();
//     console.log('Packet:', packet);
// }

// {
//     const hexStream = new HexStream('EE00D40C823060');
//     const packet = hexStream.getPacket();
//     console.log('Packet:', packet);
// }

// Later testing
// {
//     const hexStream = new HexStream('C200B40A82');
//     const [,, packet] = hexStream.getPacket();
//     console.log('Packet:', packet, 'Expected:', 3);
// }
// {
//     const hexStream = new HexStream('04005AC33890');
//     const [,, packet] = hexStream.getPacket();
//     console.log('Packet:', packet, 'Expected:', 54);
// }
// {
//     const hexStream = new HexStream('880086C3E88112');
//     const [,, packet] = hexStream.getPacket();
//     console.log('Packet:', packet, 'Expected:', 7);
// }
// {
//     const hexStream = new HexStream('CE00C43D881120');
//     const [,, packet] = hexStream.getPacket();
//     console.log('Packet:', packet, 'Expected:', 9);
// }

// Part 1:
function sumVersions(packets) {
    let sum = 0;
    // eslint-disable-next-line no-unused-vars, no-restricted-syntax
    for (const [version, typeId, packet, length] of packets) {
        // console.log('Adding', version, 'to sum');
        sum += version;
        if (Array.isArray(packet)) {
            // console.log('Packet is array, recursing...');
            sum += sumVersions(packet);
        }
    }
    return sum;
}

// eslint-disable-next-line no-unused-vars
function testone() {
    const t = test1;
    for (let i = 0; i < t.length; i += 2) {
        const hexStream = new HexStream(t[i]);
        const expected = t[i + 1];
        // eslint-disable-next-line no-unused-vars
        const [version, typeId, packet, length] = hexStream.getPacket();
        console.log('Packet:', JSON.stringify(packet));
        const sum = sumVersions(packet) + version;
        console.log('Sum:', sum, 'Expected:', expected);
    }
}

// testone();

// eslint-disable-next-line no-unused-vars
function puzzle1() {
    const hexStream = new HexStream(input);
    // eslint-disable-next-line no-unused-vars
    const [version, typeId, packet, length] = hexStream.getPacket();
    console.log('Packet:', JSON.stringify(packet));
    const sum = sumVersions(packet) + version;
    console.log('Sum:', sum);
    // console.log('Versum:', versum);
    return sum;
}

// const part1 = puzzle1();
// console.log('Part 1:', part1);

// Part 2:
// eslint-disable-next-line no-unused-vars
function testtwo() {
    const t = test2;
    for (let i = 0; i < t.length; i += 2) {
        const hexStream = new HexStream(t[i]);
        const expected = t[i + 1];
        // eslint-disable-next-line no-unused-vars
        const [version, typeId, packet, length] = hexStream.getPacket();
        console.log('Packet:', JSON.stringify(packet), 'Expected:', expected);
    }
}

// testtwo();


function puzzle2() {
    const hexStream = new HexStream(input);
    const [,, packet] = hexStream.getPacket();
    return packet;
}

const part2 = puzzle2();
console.log('Part 2:', part2);
