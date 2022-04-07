import React, { ComponentClass, ReactComponentElement } from 'react';
import { useLocation } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import { Button, Row, Stack } from 'react-bootstrap';


type SelectorChangeCallback = (selected: string) => void;

interface SelectorOptions { 
    options: {label: string, value: string}[];
    firstSelected: string;
    groupName: string;
    callback: SelectorChangeCallback;
}


class RadioSelector extends React.Component<SelectorOptions> {
    constructor(props: SelectorOptions) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.callback(event.target.value);
        
    }
    render() {
        return (
            <div onChange={this.handleChange}>
                {this.props.options.map(option => {
                    var radio = <input type="radio" id={option.value} value={option.value} name={this.props.groupName} />
                    if (option.value == this.props.firstSelected) {
                        var radio = <input type="radio" id={option.value} value={option.value} name={this.props.groupName} defaultChecked />
                    }
                    return (
                        <div key={option.value}>
                            {radio}
                            <label htmlFor={option.value}>{option.label}</label>
                        </div>
                    )}
                )}
            </div>
        );
    }
}

const Loader = () => {
    return (
        <div className="text-center justify-content-md-center">
            <Spinner animation="grow" size="sm" role="status"/> Načítá se...
        </div>);
}

interface PagingProps {
    increment: number;
    totalCount: number;
    setDisplayCount: (newCount: number) => void;
}

class Paging extends React.Component<PagingProps, {displayedCount: number}> {

    constructor(props: PagingProps) {
        super(props);
        this.state = { displayedCount: props.increment <= props.totalCount ? props.increment : props.totalCount };
        this.handleShowMore = this.handleShowMore.bind(this);
        this.handleShowAll = this.handleShowAll.bind(this);
    }

    handleShowMore() {
        var total = this.props.totalCount;
        var displayed = this.state.displayedCount;
        var increment = this.props.increment;
        if ( displayed + increment <= total) {
            displayed += increment;
        } else {
            displayed += (total - displayed);
        }
        this.setState({displayedCount: displayed});
        this.props.setDisplayCount(displayed);
    }
    handleShowAll() {
        this.setState({displayedCount: this.props.totalCount});
        this.props.setDisplayCount(this.props.totalCount);
    } 

    render() {
        return (
            <Stack className="text-center justify-content-md-center">
                <div>
                    <p>Zobrazeno: {this.state.displayedCount} z {this.props.totalCount}</p>
                </div>
                { this.state.displayedCount !== this.props.totalCount && 
                    <Stack direction="horizontal" className="text-center justify-content-md-center">
                        <div>
                                <Button variant="light" onClick={this.handleShowMore}>Zobrazit další</Button>
                        </div>
                        <div>
                                <Button variant="light" onClick={this.handleShowAll}>Zobrazit vše</Button>
                        </div>
                    </Stack> }
            </Stack> 
        );
    }
}

const OutletWithQueryParam = (param: string, element: ComponentClass<{param: string}, any>) => {
    var params = new URLSearchParams(useLocation().search);
    var paramValueOrNull = params.get(param);
    var paramValue = paramValueOrNull == null? "" : paramValueOrNull;
    return React.createElement(element, {param: paramValue} );
}

// type A<X extends 1 | 2> = ({ 1: number, 2: string })[X];
// type ttt = A<1>;

// type Maybe2<T> = {
//   hasValue: boolean;
// } | T;

// type Maybe<T> = {
//   hasValue: true;
//   value: T;
// } | {
//   hasValue: false;
// };

// var m: Maybe<Date> = {} as any;

// if (m.hasValue) {
//   m.value;
// }

export type { SelectorOptions, SelectorChangeCallback };
export { RadioSelector, Loader, Paging };