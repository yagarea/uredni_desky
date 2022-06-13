import React, { ComponentClass, ReactComponentElement } from 'react';
import { useLocation } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import { Button, Row, Stack } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


type OptionChangeCallback = (selected: string) => void;

interface SelectorOptions { 
    options: {label: string, value: string}[];
    firstSelected: string;
    groupName: string;
    callback: OptionChangeCallback;
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

interface CheckboxOptions { 
    options: {label: string, value: string, checked: boolean}[]; 
    callback: OptionChangeCallback;
}

class CheckboxGroup extends React.Component<CheckboxOptions> {
    constructor(props: CheckboxOptions) {
        super(props);
    }
    handleChange(optionValue: string) {
        this.props.callback(optionValue);
    }
    render() {
        return (
            <div >
                {this.props.options.map((option) => {
                
                    if (option.checked) {
                        var checkbox = <Form.Check type="switch" defaultChecked  id={option.value} value={option.value} name={option.value} 
                                        onChange={() => this.handleChange(option.value)} 
                                        label={option.label} />
                    } else {
                        var checkbox = <Form.Check type="switch" id={option.value} value={option.value} name={option.value} 
                                        onChange={() => this.handleChange(option.value)}
                                        label={option.label} />
                    }
                    return (
                        <div key={option.value}>
                            {/* <label htmlFor={option.value}>{option.label}</label> */}
                            {checkbox}
                        </div>
                    )}
                )}
            </div>
        );
    }
}

const Loader = () => {
    return (
        <div className="text-center justify-content-md-center m-2">
            <Spinner animation="grow" size="sm" role="status"/> Načítá se...
        </div>);
}

const HoverTooltip = (props: {tooltipText: string, innerElement: any}) => {
    const renderTooltip = (tooltipProps: any) => (
        <Tooltip id="button-tooltip" {...tooltipProps}>
          {props.tooltipText}
        </Tooltip>
      );

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}>
            {props.innerElement}
        </OverlayTrigger>
    );
}

interface SimplePagingProps {
    displayed: number;
    total: number;
    handleMore: () => void;
    handleAll: () => void;
}

class SimplePaging extends React.Component<SimplePagingProps>{
    constructor(props: SimplePagingProps) {
        super(props);
    }
    render() {
        return (
            <Stack className="text-center justify-content-md-center m-2">
                <div className="m-2">
                    <p>Zobrazeno: {this.props.displayed} z {this.props.total}</p>
                </div>
                { this.props.displayed !== this.props.total && 
                    <Stack direction="horizontal" className="text-center justify-content-md-center">
                        <div className="m-2">
                                <Button variant="outline-secondary" onClick={this.props.handleMore}>Zobrazit další</Button>
                        </div>
                        <div className="m-2">
                                <Button variant="outline-secondary" onClick={this.props.handleAll}>Zobrazit vše</Button>
                        </div>
                    </Stack> }
            </Stack> 
        );
    }
}

interface PagingProps {
    displayedCount: number;
    increment: number;
    totalCount: number;
    setDisplayCount: (newCount: number) => void;
}

class Paging extends React.Component<PagingProps> {

    constructor(props: PagingProps) {
        super(props);
        // this.state = { displayedCount: props.increment <= props.totalCount ? props.increment : props.totalCount };
        this.handleShowMore = this.handleShowMore.bind(this);
        this.handleShowAll = this.handleShowAll.bind(this);
    }

    handleShowMore() {
        var total = this.props.totalCount;
        var displayed = this.props.displayedCount;
        var increment = this.props.increment;
        if ( displayed + increment <= total) {
            displayed += increment;
        } else {
            displayed += (total - displayed);
        }
        // this.setState({displayedCount: displayed});
        this.props.setDisplayCount(displayed);
    }
    handleShowAll() {
        // this.setState({displayedCount: this.props.totalCount});
        this.props.setDisplayCount(this.props.totalCount);
    } 

    render() {
        return (
            <Stack className="text-center justify-content-md-center">
                <div>
                    <p>Zobrazeno: {this.props.displayedCount} z {this.props.totalCount}</p>
                </div>
                { this.props.displayedCount !== this.props.totalCount && 
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

export type { SelectorOptions, OptionChangeCallback, CheckboxOptions };
export { RadioSelector, CheckboxGroup, Loader, Paging, HoverTooltip, SimplePaging };