import React from 'react';

export const SecurityUpdatesWidget: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <h4 className="font-medium mb-2">Security Fixes - In Progress</h4>
        <p className="text-muted-foreground">
          Customer reported vulnerabilities are being addressed with priority fixes.
        </p>
      </div>
      <div>
        <h4 className="font-medium mb-2">Commerce Connector 2.0 - 96% Complete</h4>
        <p className="text-muted-foreground">
          CC2.0 integration completed with additional requirements implementation.
        </p>
      </div>
      <div>
        <h4 className="font-medium mb-2">GraphQL Phase III</h4>
        <p className="text-muted-foreground">
          Development on hold due to bandwidth. Training sessions continue (last session: Aug 20th).
        </p>
      </div>
      <div>
        <h4 className="font-medium mb-2">Hotfix Version 10.2.1.2</h4>
        <p className="text-muted-foreground">
          Planned for critical priority tenant tickets across multiple customers.
        </p>
      </div>
    </div>
  );
};