const { program, Command } = require('commander');
const chalk = require('chalk');
const format = require('date-format');
const { Workspace, MILLIS_TO_HOURS } = require('../core/workspace');

program.addCommand(new Command('view')
  .aliases(['v'])
  .description('views a workspace')
  .action(function() {
    const ws = Workspace.load(program.opts().ws);
    if (ws) {
      let cycles = [];

      /**
       * @type {Date}
       */
      let clkin = undefined;
      ws.clocks.forEach(clk => {
        if (clkin) {
          // Add cycle
          cycles.push(renderCycle(clkin, clk));
          clkin = undefined;
        }
        else clkin = clk;
      });
      // Add cycle
      if (clkin) {
        cycles.push(renderCycle(clkin));
      }

      console.log(`name: ${chalk.greenBright(ws.name)}`);
      console.log(`time: ${chalk.cyanBright(ws.time.toFixed(2))} hours`);
      console.log('--------------------------------------------');
      cycles.reverse().forEach(cyc => {
        console.log(cyc);
      });
    }
    else {
      console.log(chalk.yellowBright('Workspace does not exist.'));
    }
  }));

/**
 * @param {Date} clkin 
 * @param {Date} clkout 
 * @returns {string}
 */
function renderCycle(clkin, clkout) {
  let render = `${chalk.greenBright(format('MM/dd hh:mm', clkin))} - `;
  if (clkout) {
    render += `${chalk.greenBright(format('MM/dd hh:mm', clkout))}`;
  }
  else {
    render += '    ....   ';
  }
  const cycleTime = MILLIS_TO_HOURS * (clkout ? clkout.getTime() - clkin.getTime() : Date.now() - clkin.getTime());
  return `| ${render} | ${chalk.cyanBright(cycleTime.toFixed(2))} hours`;
}