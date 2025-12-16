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

    return infinityQuery.data
        ? (infinityQuery.data.pages.map((page: IPage<ILog>) => (
                    page.results.map(
                        (item: any, index: number) => {
                            const Item = BaseItemWrapper;
                            return (
                                <React.Fragment key={item._id || item.name}>
                                    <Item
                                        id={item._id || item.name}
                                        activeItemsHandler={activeItemsHandler}
                                        infinityQuery={infinityQuery}
                                        index={index}
                                        item={item}
                                        itemType={groupByValue}
                                    />
                                </React.Fragment>
                            );
                        },
                    )
                )
            )
        )
        : [];
}
