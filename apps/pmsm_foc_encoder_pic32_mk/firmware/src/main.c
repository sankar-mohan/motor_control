/*******************************************************************************
  Main Source File

  Company:
    Microchip Technology Inc.

  File Name:
    main.c

  Summary:
    This file contains the "main" function for a project.

  Description:
    This file contains the "main" function for a project.  The
    "main" function calls the "SYS_Initialize" function to initialize the state
    machines of all modules in the system
 *******************************************************************************/

// *****************************************************************************
// *****************************************************************************
// Section: Included Files
// *****************************************************************************
// *****************************************************************************

#include <stddef.h>                     // Defines NULL
#include <stdbool.h>                    // Defines true
#include <stdlib.h>                     // Defines EXIT_FAILURE
#include "definitions.h"                // SYS function prototypes
#include "mc_app.h"
#include "mc_picontrol.h"
#include "mc_errorHandler.h"
#include "mc_infrastructure.h"
#include "X2CScope.h"
#include "X2CScopeCommunication.h"


// *****************************************************************************
// *****************************************************************************
// Section: Main Entry Point
// *****************************************************************************
// *****************************************************************************

int main ( void )
{
    /* Start-up Check  */
    MCERR_StartupCheck();
    
    /* System Initialization  */
    SYS_Initialize ( NULL );

    /* X2C Scope initialization */
    X2CScope_Init();

    /* Initialize peripheral for motor control */
    MCINF_InitializeControl();

    while ( true )
    {
        MCINF_Tasks();
        X2CScope_Communicate();
    }

    /* Execution should not come here during normal operation */
    return ( EXIT_FAILURE );
}


/*******************************************************************************
 End of File
*/
