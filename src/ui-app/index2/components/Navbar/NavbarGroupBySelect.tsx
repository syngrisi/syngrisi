import * as React from 'react';
import SafeSelect from '../../../shared/components/SafeSelect';

interface Props {
    setActiveItems: any;
    groupByValue: string,
    setGroupByValue: any,
}

export function NavbarGroupBySelect({ setActiveItems, groupByValue, setGroupByValue }: Props) {
    const handleGroupBySelect = (value: string) => {
        setActiveItems(() => []);
        setGroupByValue(value);
    };

    return (
        <SafeSelect
            label="Group by"
            data-test="navbar-group-by"
            value={groupByValue}
            onChange={handleGroupBySelect}
            optionsData={[
                { value: 'runs', label: 'Runs' },
                { value: 'suites', label: 'Suites' },
                { value: 'test-distinct/browserName', label: 'Browsers' },
                { value: 'test-distinct/os', label: 'Platform' },
                // { value: 'test-distinct/viewport', label: 'Viewport' },
                { value: 'test-distinct/status', label: 'Test Status' },
                { value: 'test-distinct/markedAs', label: 'Accept Status' },
            ]}
        />
    );
}
