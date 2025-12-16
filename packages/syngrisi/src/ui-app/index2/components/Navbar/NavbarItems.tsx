/* eslint-disable */
import * as React from 'react';
import { IPage } from '@shared/interfaces/logQueries';
import ILog from '@shared/interfaces/ILog';
import { BaseItemWrapper } from '@index/components/Navbar/Items/BaseItemWrapper';

type Props = {
    infinityQuery: any,
    groupByValue: string,
    activeItemsHandler: any
};

export function NavbarItems({ infinityQuery, groupByValue, activeItemsHandler }: Props) {

    if (!infinityQuery.data) return [];

    let globalIndex = 0;

    return infinityQuery.data.pages.flatMap((page: IPage<ILog>) => (
        page.results.map(
            (item: any) => {
                const Item = BaseItemWrapper;
                const currentIndex = globalIndex;
                globalIndex += 1;

                return (
                    <React.Fragment key={item._id || item.name}>
                        <Item
                            id={item._id || item.name}
                            activeItemsHandler={activeItemsHandler}
                            infinityQuery={infinityQuery}
                            index={currentIndex}
                            item={item}
                            itemType={groupByValue}
                        />
                    </React.Fragment>
                );
            },
        )
    ));
}
