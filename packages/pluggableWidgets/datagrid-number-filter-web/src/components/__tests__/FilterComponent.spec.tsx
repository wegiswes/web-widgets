import "@testing-library/jest-dom";
import { createElement } from "react";
import { FilterComponent } from "../FilterComponent";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

jest.useFakeTimers();

describe("Filter component", () => {
    it("renders correctly", () => {
        const dom = render(<FilterComponent adjustable defaultFilter="equal" delay={500} />);

        expect(dom.baseElement).toMatchSnapshot();
    });

    it("renders correctly when not adjustable by user", () => {
        const dom = render(<FilterComponent adjustable={false} defaultFilter="equal" delay={500} />);

        expect(dom.baseElement).toMatchSnapshot();
    });

    it("renders correctly with aria labels", () => {
        const dom = render(
            <FilterComponent
                adjustable
                defaultFilter="equal"
                delay={500}
                screenReaderButtonCaption="my label"
                screenReaderInputCaption="my label"
            />
        );

        expect(dom.baseElement).toMatchSnapshot();
    });

    it("calls updateFilters when value changes", () => {
        const updateFiltersHandler = jest.fn();
        const dom = render(
            <FilterComponent defaultFilter="equal" adjustable delay={500} updateFilters={updateFiltersHandler} />
        );

        act(() => {
            const input = dom.getByRole("spinbutton");
            fireEvent.change(input, { target: { value: "23" } });
        });

        expect(updateFiltersHandler).toBeCalled();
    });

    // it("debounces calls for updateFilters when value changes with numbers", () => {
    //     const updateFiltersHandler = jest.fn();
    //     const component = shallow(
    //         <FilterComponent defaultFilter="equal" adjustable delay={500} updateFilters={updateFiltersHandler} />
    //     );

    //     // Initial call with default filter
    //     expect(updateFiltersHandler).toBeCalledTimes(1);

    //     const input = component.find("input");
    //     input.simulate("change", { target: { value: "0" } });
    //     jest.advanceTimersByTime(499);
    //     input.simulate("change", { target: { value: "1" } });
    //     input.simulate("change", { target: { value: "2" } });
    //     jest.advanceTimersByTime(500);

    //     expect(updateFiltersHandler).toBeCalledTimes(2);

    //     input.simulate("change", { target: { value: "3" } });
    //     jest.advanceTimersByTime(500);

    //     expect(updateFiltersHandler).toBeCalledTimes(3);
    // });

    // it("debounces calls for updateFilters when value changes with decimals", () => {
    //     const updateFiltersHandler = jest.fn();
    //     const component = shallow(
    //         <FilterComponent adjustable defaultFilter="equal" delay={500} updateFilters={updateFiltersHandler} />
    //     );

    //     // Initial call with default filter
    //     expect(updateFiltersHandler).toBeCalledTimes(1);

    //     const input = component.find("input");
    //     input.simulate("change", { target: { value: "0.0" } });
    //     jest.advanceTimersByTime(499);
    //     input.simulate("change", { target: { value: "1.7" } });
    //     input.simulate("change", { target: { value: "4" } });
    //     jest.advanceTimersByTime(500);

    //     expect(updateFiltersHandler).toBeCalledTimes(2);

    //     input.simulate("change", { target: { value: "6.8" } });
    //     jest.advanceTimersByTime(500);

    //     expect(updateFiltersHandler).toBeCalledTimes(3);
    // });

    // it("debounces calls for updateFilters when value changes with invalid input", () => {
    //     const updateFiltersHandler = jest.fn();
    //     const component = shallow(
    //         <FilterComponent adjustable defaultFilter="equal" delay={500} updateFilters={updateFiltersHandler} />
    //     );

    //     // Initial call with default filter
    //     expect(updateFiltersHandler).toBeCalledTimes(1);

    //     const input = component.find("input");
    //     input.simulate("change", { target: { value: "test1" } });
    //     jest.advanceTimersByTime(499);
    //     input.simulate("change", { target: { value: "test2" } });
    //     input.simulate("change", { target: { value: "test3" } });
    //     jest.advanceTimersByTime(500);

    //     // Consecutive invalid numbers wont call useState with empty value twice
    //     // this is why we expect func to be called 1 time
    //     expect(updateFiltersHandler).toBeCalledTimes(1);

    //     input.simulate("change", { target: { value: "test4" } });
    //     jest.advanceTimersByTime(500);

    //     expect(updateFiltersHandler).toBeCalledTimes(1);
    // });
});
