import { createRef, h, JSX } from 'preact';

import { BaseComponent, BaseProps } from '../base';
import { classJoin, className } from '../../util/className';
import { TColumn } from '../../types';
import { Sort } from '../plugin/sort/sort';

export interface THProps extends BaseProps {
  index: number;
  column: TColumn;
}

export class TH extends BaseComponent<THProps, {}> {
  private sortRef = createRef();

  private isSortable(): boolean {
    return this.props.column.sort.enabled;
  }

  private onClick(e: JSX.TargetedMouseEvent<HTMLInputElement>): void {
    e.stopPropagation();

    if (this.isSortable()) {
      this.sortRef.current.changeDirection(e);
    }
  }

  private keyDown(e: JSX.TargetedMouseEvent<HTMLInputElement>): void {
    if (this.isSortable() && e.which === 13) {
      this.onClick(e);
    }
  }

  render() {
    const cls = classJoin(
      className('th'),
      this.isSortable() ? className('th', 'sort') : null,
    );

    const props = {};

    if (this.isSortable()) {
      props['tabIndex'] = 0;
    }

    return (
      <th
        className={cls}
        onClick={this.onClick.bind(this)}
        style={{ width: this.props.column.width }}
        onKeyDown={this.keyDown.bind(this)}
        {...props}
      >
        {this.props.column.name}
        {this.isSortable() && (
          <Sort
            ref={this.sortRef}
            index={this.props.index}
            {...this.props.column.sort}
          />
        )}
      </th>
    );
  }
}
