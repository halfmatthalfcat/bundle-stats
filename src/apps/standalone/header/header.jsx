import PropTypes from 'prop-types';
import cx from 'classnames';
import { Header as UIHeader } from '@relative-ci/ui/lib-esm/layout/header';
import { Logo } from '@relative-ci/ui/lib-esm/ui/logo';
import { Tabs } from '@relative-ci/ui/lib-esm/ui/tabs';

import css from './header.module.css';

export const Header = ({ className }) => (
  <UIHeader
    className={cx(css.root, className)}
    renderLeft={partProps => (
      <div {...partProps}>
        <Logo
          className={css.webpackLogo}
          kind="webpack"
          as="a"
          href="https://webpack.js.org"
          target="_blank"
          rel="noopener noreferrer nofollow"
        />
        <h1 className={css.title}>
          Bundle Stats
        </h1>
      </div>
    )}
    render={partProps => (
      <div {...partProps}>
        <Tabs className={cx(css.center, css.tabs)}>
          <a
            href="#totals"
            title="Go to Totals section"
          >
            Totals
          </a>
          <a
            href="#assets"
            title="Go to Assets section"
          >
            Assets
          </a>
          <a
            href="#modules"
            title="Go to Modules section"
          >
            Modules
          </a>
        </Tabs>
      </div>
    )}
    renderRight={partProps => (
      <div {...partProps}>
        <Logo
          className={css.githubLogo}
          kind="github"
          as="a"
          href="https://github.com/relative-ci/webpack-bundle-stats"
          target="_blank"
          rel="noopener noreferrer nofollow"
        />
      </div>
    )}
  />
);

Header.defaultProps = {
  className: '',
};

Header.propTypes = {
  /** Adopted child classname */
  className: PropTypes.string,
};