const myFunc = (num: number): number => num * num;

export default myFunc;

export class MyClass {
    name!: string;

    testing() {
        console.log('test');
        this.name = 'rabie';
    }
}
