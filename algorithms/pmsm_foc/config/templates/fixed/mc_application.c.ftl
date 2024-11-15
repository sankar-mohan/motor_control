/**
 * @file application.c
 *
 * @brief 
 *   Application source file
 *
 * @Company 
 *    Microchip Technology Inc.
 *
 * @Summary
 *   Header file defining application-specific details.
 *
 * @Description
 *   This header file provides definitions and structures specific to the application,
 *   including configuration settings, function prototypes, and any other necessary details.
 */

// DOM-IGNORE-BEGIN
/*******************************************************************************
 * Copyright (C) 2022 Microchip Technology Inc. and its subsidiaries.
 *
 * Subject to your compliance with these terms, you may use Microchip software
 * and any derivatives exclusively with Microchip products. It is your
 * responsibility to comply with third party license terms applicable to your
 * use of third party software (including open source software) that may
 * accompany Microchip software.
 *
 * THIS SOFTWARE IS SUPPLIED BY MICROCHIP "AS IS". NO WARRANTIES, WHETHER
 * EXPRESS, IMPLIED OR STATUTORY, APPLY TO THIS SOFTWARE, INCLUDING ANY IMPLIED
 * WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY, AND FITNESS FOR A
 * PARTICULAR PURPOSE.
 *
 * IN NO EVENT WILL MICROCHIP BE LIABLE FOR ANY INDIRECT, SPECIAL, PUNITIVE,
 * INCIDENTAL OR CONSEQUENTIAL LOSS, DAMAGE, COST OR EXPENSE OF ANY KIND
 * WHATSOEVER RELATED TO THE SOFTWARE, HOWEVER CAUSED, EVEN IF MICROCHIP HAS
 * BEEN ADVISED OF THE POSSIBILITY OR THE DAMAGES ARE FORESEEABLE. TO THE
 * FULLEST EXTENT ALLOWED BY LAW, MICROCHIP'S TOTAL LIABILITY ON ALL CLAIMS IN
 * ANY WAY RELATED TO THIS SOFTWARE WILL NOT EXCEED THE AMOUNT OF FEES, IF ANY,
 * THAT YOU HAVE PAID DIRECTLY TO MICROCHIP FOR THIS SOFTWARE.
 *******************************************************************************/
// DOM-IGNORE-END


/*******************************************************************************
Headers inclusions
 *******************************************************************************/
#include "mc_types.h" /** ToDO: Move it to header files */
#include "mc_application.h"
#include "mc_hardware_abstraction.h"  /** ToDO: Move it to header files */
#include "definitions.h"
#include "mc_utilities.h"
#include "mc_voltage_measurement.h"
#include "mc_motor.h"

/*******************************************************************************
 * Constants
 *******************************************************************************/

/*******************************************************************************
 Private data-types
 *******************************************************************************/

/*******************************************************************************
 Private variables
 *******************************************************************************/
static button_response_t  mcAppI_DirectionButton_gds;
static button_response_t  mcAppI_StartStopButton_gds;
static uint32_t mcAppI_1msSyncCounter_gdu32;
static uintptr_t dummyForMisra;

/*******************************************************************************
 Interface variables
 *******************************************************************************/

/*******************************************************************************
 Private Functions
 *******************************************************************************/
/**
 * @brief Start/stop button scan
 *
 * @details Controls motor start/stop based on button input.
 *
 * @param[in] None
 * @param[in/out] None
 * @param[out] None
 *
 * @return None
 */
/** ToDO: To replace later with a structure variable */
static uint8_t runStatus = 0u;
__STATIC_INLINE void mcAppI_MotorStartStop(void)
{
    if( 0u == runStatus )
    {
        /** Start motor  */
        mcFocI_FieldOrientedControlEnable( &mcFocI_ModuleData_gds );

        /** Enable voltage source inverter */
        mcHalI_InverterPwmEnable();

        runStatus = 1u;
    }
    else
    {
        /** Stop motor  */
        mcFocI_FieldOrientedControlDisable( &mcFocI_ModuleData_gds );

        /** Enable voltage source inverter */
        mcHalI_InverterPwmDisable();

        runStatus = 0u;
    }
}

/**
 * @brief Direction reverse button scan
 *
 * @details Reverses motor direction based on button input.
 *
 * @param[in] None
 * @param[in/out] None
 * @param[out] None
 *
 * @return None
 */
__STATIC_INLINE void mcAppI_DirectionReverse(void)
{
    /** ToDO: Change state variable to toggle motor spin direction  */
    if( 0u == runStatus )
    {
        mcFocI_MotorDirectionChange(&mcFocI_ModuleData_gds);

        /** Direction indication */
        mcHal_DirectionIndication();
    }
}

/**
 * @brief 1 ms tasks handler
 *
 * @details Handles tasks to be executed every 1 ms.
 *
 * @param[in] None
 * @param[in/out] None
 * @param[out] None
 *
 * @return None
 */
__STATIC_INLINE void mcAppI_1msTasksHandler( void )
{
    /** Start-stop button scan  */
    mcAppI_StartStopButton_gds.inputVal = mcHalI_StartStopButtonState();
    mcUtils_ButtonResponse(&mcAppI_StartStopButton_gds, &mcAppI_MotorStartStop);

    /** Direction button scan  */
    mcAppI_DirectionButton_gds.inputVal = mcHalI_DirectionButtonState();
    mcUtils_ButtonResponse(&mcAppI_DirectionButton_gds, &mcAppI_DirectionReverse);

    /** Field Oriented control - Slow Tasks */
    mcFocI_FieldOrientedControlSlow(&mcFocI_ModuleData_gds);
}

/*******************************************************************************
 Interface Functions
 *******************************************************************************/

/**
 * @brief Application initialization
 *
 * @details Initializes the application.
 *
 * @param[in] None
 * @param[in/out] None
 * @param[out] None
 *
 * @return None
 */
void mcAppI_ApplicationInit( void )
{
    /** ADC end of conversion interrupt generation for FOC control */
    mcHalI_AdcInterruptDisable();
    mcHalI_AdcInterruptClear();

<#if ("ADC_U2500" == MCPMSMFOC_ADC_IP )  || ("ADC_U2247" == MCPMSMFOC_ADC_IP )>
    /** Set phase A and phase B current channels */
    mcHalI_PhaseACurrentChannelSelect();
    mcHalI_PhaseBCurrentChannelSelect();
</#if>

    /** Enable ADC interrupt for field oriented control */
    mcHalI_AdcCallBackRegister(  (ADC_CALLBACK)mcAppI_AdcCalibrationIsr, (uintptr_t)dummyForMisra );
    mcHalI_AdcInterruptEnable( );

    /** Enable ADC module */
    mcHalI_AdcEnable();

    /** Enable interrupt for fault detection */
    mcHalI_PwmCallbackRegister( (TCC_CALLBACK)mcAppI_OverCurrentReactionIsr, (uintptr_t)dummyForMisra );

    /** TEnable PWM fault interrupt for Over-current reaction */
    mcHalI_PwmInterruptEnable( );

    /** Enables PWM channels. */
    mcHalI_PwmTimerStart( );

    /** Disable PWM output */
    mcHalI_InverterPwmDisable();

    /** Set motor parameters */
    mcMotI_MotorParametersInit( &mcMotI_PMSM_gds);

    /** Initialize Current measurement  */
    mcCurI_CurrentCalculationInit( &mcCurI_ModuleData_gds );

    /** Initialize Voltage measurement  */
    mcVolI_VoltageCalculationInit( &mcVolI_ModuleData_gds );

    /** Initialize PMSM motor control */
    mcFocI_FieldOrientedControlInit( &mcFocI_ModuleData_gds);

}

/**
 * @brief Over current reaction ISR
 *
 * @details Interrupt service routine for over current reaction.
 *
 * @param[in] status Status information
 * @param[in/out] context Interrupt context
 * @param[out] None
 *
 * @return None
 */
void mcAppI_OverCurrentReactionIsr( uint32_t status,  uintptr_t context )
{
    /** Disable field oriented control  */
    mcFocI_FieldOrientedControlDisable( &mcFocI_ModuleData_gds );

    /** Reset software modules */
    mcAppI_ApplicationReset();

    /** Enable voltage source inverter */
    mcHalI_InverterPwmDisable();

}

/**
 * @brief Motor control application calibration ISR
 *
 * @details Interrupt service routine for motor control application calibration.
 *
 * @param[in] status ADC status information
 * @param[in/out] context Interrupt context
 * @param[out] None
 *
 * @return None
 */
void mcAppI_AdcCalibrationIsr( ADC_STATUS status, uintptr_t context )
{
    tmcTypes_StdReturn_e returnStatus;

    /** ADC end of conversion interrupt generation for FOC control */
    mcHalI_AdcInterruptDisable();
    mcHalI_AdcInterruptClear();

    /** Read phase currents  */
    mcHalI_PhaseACurrentGet();
    mcHalI_PhaseBCurrentGet();

    /** Phase current offset measurement  */
    returnStatus = mcCurI_CurrentOffsetCalculation(&mcCurI_ModuleData_gds );

    /** Current sense amplifiers offset calculation */
    if( StdReturn_Complete == returnStatus )
    {
        mcHalI_AdcCallBackRegister( (ADC_CALLBACK)mcAppI_AdcFinishedIsr, (uintptr_t)dummyForMisra );
    }
    else
    {
        /** For MISRA compliance */
    }

    /** Calibration and monitoring update */
    X2Cscope_Update();

     /** ADC end of conversion interrupt generation for FOC control */
    mcHalI_AdcInterruptClear();
    mcHalI_AdcInterruptEnable();
}

/**
 * @brief ADC finished ISR
 *
 * @details Interrupt service routine for ADC finished tasks.
 *
 * @param[in] status ADC status information
 * @param[in/out] context Interrupt context
 * @param[out] None
 *
 * @return None
 */
#ifdef RAM_EXECUTE
void __ramfunc__  mcAppI_AdcFinishedIsr( ADC_STATUS status, uintptr_t context )
#else
void  mcAppI_AdcFinishedIsr( ADC_STATUS status, uintptr_t context )
#endif
{
    /** ADC interrupt disable  */
    mcHalI_AdcInterruptDisable();
    mcHalI_AdcInterruptClear();

    /** Read phase currents  */
    mcHalI_PhaseACurrentGet();

<#if MCPMSMFOC_PHASE_CURRENT_IA_UNIT == MCPMSMFOC_PHASE_CURRENT_IB_UNIT>
    /** Update channel for phase B current measurement */
    mcHalI_PhaseBCurrentChannelSelect();

    /** Start ADC conversion  */
    mcHalI_AdcSoftwareConversionStart();

    /** Wait for ADC conversion to complete */
    mcHalI_AdcConversionWait();

    mcHalI_PhaseBCurrentGet();

<#else>
    mcHalI_PhaseBCurrentGet();
</#if>

    /** Re-assign ADC channels for DC link voltage and potentiometer input */
    mcHalI_DcLinkVoltageChannelSelect();

<#if MCPMSMFOC_POTENTIOMETER_VPOT_UNIT != MCPMSMFOC_BUS_VOLTAGE_VDC_UNIT>
    mcHalI_PotentiometerChannelSelect();
</#if>

    /** Trigger ADC channel conversion */
    mcHalI_AdcSoftwareConversionStart();

    /** Current measurement  */
    mcCurI_CurrentCalculation( &mcCurI_ModuleData_gds );

    /** Field Oriented Control  */
    mcFocI_FieldOrientedControlFast(&mcFocI_ModuleData_gds);

    /** Set duty */
    mcHalI_InverterPwmSet(mcPwmI_Duty_gau16);

<#if MCPMSMFOC_POTENTIOMETER_VPOT_UNIT != MCPMSMFOC_BUS_VOLTAGE_VDC_UNIT>
    /** Wait for ADC conversion to complete */
    mcHalI_AdcConversionWait();

    /** Read DC bus input */
    mcHalI_DcLinkVoltageGet();

    /** Read potentiometer input */
    mcHalI_PotentiometerInputGet();

<#else>
    /** Wait for ADC conversion to complete */
    mcHalI_AdcConversionWait();

    /** Read DC bus input */
    mcHalI_DcLinkVoltageGet();

    /** Select potentiometer channel */
    mcHalI_PotentiometerChannelSelect();

    /** Start ADC conversion  */
    mcHalI_AdcSoftwareConversionStart();

    /** Wait for ADC conversion to complete */
    mcHalI_AdcConversionWait();

    /** Read potentiometer input */
    mcHalI_PotentiometerInputGet();
</#if>

    /** Bus voltage calculation */
    mcVolI_VoltageCalculation( &mcVolI_ModuleData_gds );

<#if MCPMSMFOC_PHASE_CURRENT_IA_UNIT == MCPMSMFOC_PHASE_CURRENT_IB_UNIT>
    /** Re-assign ADC Channels for phase current measurement at next PWM trigger */
    mcHalI_PhaseACurrentChannelSelect();
<#else>
    /** Re-assign ADC Channels for phase current measurement at next PWM trigger */
    mcHalI_PhaseACurrentChannelSelect();
    mcHalI_PhaseBCurrentChannelSelect();
</#if>
    /** Calibration and monitoring update */
    X2Cscope_Update();

    /** Increment interrupt counter */
    mcAppI_1msSyncCounter_gdu32++;

    /** ADC interrupt clear  */
    mcHalI_AdcInterruptClear();
    mcHalI_AdcInterruptEnable();
}

/**
 * @brief Non-ISR tasks execution
 *
 * @details Executes non-interrupt service routine tasks.
 *
 * @param[in] None
 * @param[in/out] None
 * @param[out] None
 *
 * @return None
 */
void mcAppI_NonISRTasks( void )
{
    float32_t loopCount = 0.001f * (float32_t)${MCPMSMFOC_PWM_FREQUENCY};
    if( mcAppI_1msSyncCounter_gdu32 >= (uint32_t)loopCount )
    {
        mcAppI_1msSyncCounter_gdu32 = 0u;
        mcAppI_1msTasksHandler();
    }
}

/**
 * @brief Application reset
 *
 * @details Resets the application.
 *
 * @param[in] None
 * @param[in/out] None
 * @param[out] None
 *
 * @return None
 */
void mcAppI_ApplicationReset( void )
{
    /** Current measurement  */
    mcCurI_CurrentCalculationReset( &mcCurI_ModuleData_gds );

    /** Voltage measurement  */
    mcVolI_VoltageCalculationReset( &mcVolI_ModuleData_gds );

    /** PMSM motor control */
    mcFocI_FieldOrientedControlReset( &mcFocI_ModuleData_gds);
}
