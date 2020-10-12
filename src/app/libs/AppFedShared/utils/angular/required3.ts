const noop = () => { };

export default function isRequired3(requiredType?: 'string' | 'boolean' | 'number') {
  return (target: any, prop: string) => {

    const NG_ON_ONIT_NAME = 'ngOnInit';

    /** ngOnInit might not be implemented by this component */
    const ngOnInitClone: Function | null = target[NG_ON_ONIT_NAME];
    console.log(`isRequired3 decor ngOnInitClone`, ngOnInitClone)

    Object.defineProperty(target, NG_ON_ONIT_NAME, {
      value: function () {

        if (this[prop] == null) {
          console.error(
            target.constructor.name +
            `isRequired3: ${prop} is required, but was not provided`
          );
        } else if ( requiredType && typeof this[prop] !== requiredType ) {
          console.error(
            target.constructor.name +
            `isRequired3: ${prop} is expected to be a ${requiredType}, but ${typeof this[prop]} was provided`
          );
        }
        // Calling the original ngOnInit with its original context
        //
        (ngOnInitClone || noop).call(this);
      }
    });
  }
}
