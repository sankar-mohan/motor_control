/**
 * @brief 
 *    Field Oriented Control (FOC) source file
 *
 * @File Name 
 *    mc_field_oriented_control.c
 *
 * @Company 
 *   Microchip Technology Inc.
 *
 * @Summary
 *    This file implements functions for Field Oriented Control (FOC).
 *
 * @Description
 *   This file contains the implementation of functions necessary for Field Oriented
 *    Control (FOC), which is used to control motor currents based on given inputs.
 *    Functions include initialization, execution, resetting, current updating,
 *    torque calculation, and field weakening control.
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
#include "mc_field_oriented_control.h"

/*******************************************************************************
Local configuration options
*******************************************************************************/

/*******************************************************************************
 Private data types
*******************************************************************************/
<#if ( MCPMSMFOC_DEVELOPER_MODE == true ) >
typedef enum {
    CONSTANT,
    PULSE_PERTURBATION
} tmcFoc_OverrideType_e;

typedef struct {
    struct {
        bool enableOpenloopControl;
        float32_t openloopSpeed;
        float32_t openloopAngle;
    }openloopControl;

    struct {
        bool enableAngleOverride;
        float32_t angleOverrideValue;
    } angleOverride;
    struct {
        bool enableOverride;
        tmcFoc_OverrideType_e overrideType;
        float32_t overrideValue;
        float32_t overridePulseHigh;
        float32_t overridePulseLow;
        uint32_t overridePulseFreq;
    } iqOverride;
    struct {
        bool enableOverride;
        tmcFoc_OverrideType_e overrideType;
        float32_t overrideValue;
        float32_t overridePulseHigh;
        float32_t overridePulseLow;
        uint32_t overridePulseFreq;
    } idOverride;
    struct {
        bool enableOverride;
        tmcFoc_OverrideType_e overrideType;
        float32_t overrideValue;
        float32_t overridePulseHigh;
        float32_t overridePulseLow;
        uint32_t overridePulseFreq;
    } speedOverride;
} tmcFoc_TuningSettings_s;
</#if>
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORLESS_ZSMT_HYBRID'>
typedef enum
{
<#if ( MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER' ) && ( MCPMSMFOC_ENABLE_FLYING_START == true ) >
    FocState_FlyingStart,
</#if>
    FocState_Startup,
    FocState_ClosingLoop,
    FocState_CloseLoop
}tmcFoc_FocState_e;
</#if>

typedef struct
 {
    bool enable;
    bool initDone;
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORLESS_ZSMT_HYBRID'>
    tmcFoc_FocState_e FocState;
</#if>
    tmcTypes_DQ_s uDQ;
<#if !(( MCPMSMFOC_POSITION_CALC_ALGORITHM == 'SENSORLESS_ZSMT_HYBRID' ) && ( MCPMSMFOC_CONTROL_TYPE != 'OPEN_LOOP' )) >
    float32_t openLoopAngle;
    float32_t openLoopSpeed;
</#if>
    float32_t iQref;
    float32_t iDref;
    float32_t nRef;
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORLESS_ZSMT_HYBRID'>
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER'>
    float32_t angleDifference;
</#if>
</#if>
    float32_t commandDirection;
    float32_t ratedSpeedInRpm;
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORLESS_ZSMT_HYBRID'>
<#if ( MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER' ) && ( MCPMSMFOC_ENABLE_FLYING_START == true ) >
    tmcFly_Parameters_s bFlyingStart;
</#if>
</#if>
    tmcSup_Parameters_s bOpenLoopStartup;
    tmcPwm_Parameters_s bPwmModulator;
    tmcFlx_Parameters_s bFluxController;
    tmcTor_Parameters_s bTorqueController;
    tmcSpe_Parameters_s bSpeedController;
<#if ( MCPMSMFOC_CONTROL_TYPE == 'POSITION_LOOP' ) >
   tmcPos_Parameters_s bPositionController;
</#if>
    tmcRef_Parameters_s bReferenceController;
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER'>
    tmcRpe_Parameters_s bPositionEstimation;
</#if>

    uint16_t duty[3u];
}tmcFoc_State_s;

/*******************************************************************************
Private variables
*******************************************************************************/
static tmcFoc_State_s mcFoc_State_mds;
<#if ( MCPMSMFOC_DEVELOPER_MODE == true ) >
static tmcFoc_TuningSettings_s  mcFoc_TuningSettings_mds;
</#if>

/*******************************************************************************
Interface  variables
*******************************************************************************/
<#if ( MCPMSMFOC_CONTROL_TYPE == 'TORQUE_LOOP' ) >
float32_t mcFoc_FocOverrideCurrent_gdf32 = 0.0f;
</#if>

tmcFocI_ModuleData_s mcFocI_ModuleData_gds;

/*******************************************************************************
Macro Functions
*******************************************************************************/
/**
 * Constant value of 2/PI
 */
#define TWO_BY_PI (float32_t)(0.6366198)

/**
 *  Open loop angle to close loop angle transition rate.
 */
<#if MCPMSMFOC_BOARD_SEL == "dsPICDEM MCLV-2">
#define ROTOR_ANGLE_RAMP_RATE     (float32_t)( 1.0e-5 )
<#elseif MCPMSMFOC_BOARD_SEL == "dsPICDEM MCHV-3">
#define ROTOR_ANGLE_RAMP_RATE     (float32_t)( 2.0e-5 )
<#else>
#define ROTOR_ANGLE_RAMP_RATE     (float32_t)( 1.0e-5 )
</#if>

/*******************************************************************************
Private Functions
*******************************************************************************/
/**
 * @brief Clarke Transformation
 *
 * @details
 * This function performs the Clarke transformation to convert three-phase
 * currents into two-phase alpha-beta currents.
 *
 * @param[in] pABC Pointer to the structure holding three-phase currents
 * @param[out] pAlphaBeta Pointer to the structure holding alpha-beta currents
 */
__STATIC_FORCEINLINE void mcFoc_ClarkeTransformation( const tmcTypes_ABC_s * pABC,
                                                                                       tmcTypes_AlphaBeta_s * const pAlphaBeta )
{
    pAlphaBeta->alpha = pABC->a;
    pAlphaBeta->beta = (pABC->a * ONE_BY_SQRT3 ) + ( pABC->b * TWO_BY_SQRT3 );
}

/**
 * @brief Park Transformation
 *
 * @details
 * This function performs the Park transformation to convert alpha-beta currents
 * into DQ currents using the provided sine and cosine values.
 *
 * @param[in] pAlphaBeta Pointer to the structure holding alpha-beta currents
 * @param[in] sine Sine value of the electrical angle
 * @param[in] cosine Cosine value of the electrical angle
 * @param[out] pDQ Pointer to the structure holding DQ currents
 */
__STATIC_FORCEINLINE void mcFoc_ParkTransformation( const tmcTypes_AlphaBeta_s * const pAlphaBeta,
                                                                                    const float32_t sine, const float32_t cosine,
                                                                                    tmcTypes_DQ_s * const pDQ )
{
    pDQ->d =  pAlphaBeta->alpha * cosine  + pAlphaBeta->beta * sine;
    pDQ->q = -pAlphaBeta->alpha * sine  + pAlphaBeta->beta * cosine;
}

/**
 * @brief Inverse Park Transformation
 *
 * @details
 * This function performs the inverse Park transformation to convert DQ currents
 * back into alpha-beta currents using the provided sine and cosine values.
 *
 * @param[in] pDQ Pointer to the structure holding DQ currents
 * @param[in] sine Sine value of the electrical angle
 * @param[in] cosine Cosine value of the electrical angle
 * @param[out] pAlphaBeta Pointer to the structure holding alpha-beta currents
 */
__STATIC_FORCEINLINE void mcFoc_InverseParkTransformation( const tmcTypes_DQ_s * const pDQ,
                                                                                                const float32_t sine, const float32_t cosine,
                                                                                                tmcTypes_AlphaBeta_s * const pAlphaBeta )
{
    pAlphaBeta->alpha =  pDQ->d * cosine - pDQ->q * sine;
    pAlphaBeta->beta  =  pDQ->d * sine  + pDQ->q * cosine;
}

/*******************************************************************************
 * Interface Functions
*******************************************************************************/
/**
 * @brief Initialize Field Oriented Control (FOC) module
 *
 * @details Initializes the FOC module.
 *
 * @param[in] pModule Pointer to the FOC module data
 * @param[in,out] None
 * @param[out] None
 * @return None
 */
void  mcFocI_FieldOrientedControlInit( tmcFocI_ModuleData_s * const pModule )
{
    /** Link state variable structure to the module */
    pModule->pStatePointer = (void *)&mcFoc_State_mds;

    /** Set parameters */
    mcFocI_ParametersSet(&pModule->dParameters);

    /** ToDO: Set default direction */
    mcFoc_State_mds.commandDirection = 1.0f;

    /** Update state variables */
    mcFoc_State_mds.ratedSpeedInRpm = pModule->dParameters.pMotorParameters->NratedInRpm;
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORLESS_ZSMT_HYBRID'>
<#if ( MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER' ) && ( MCPMSMFOC_ENABLE_FLYING_START == true ) >
    /** Initialize flying start module */
    mcFlyI_FlyingStartInit( &mcFoc_State_mds.bFlyingStart );
</#if>
</#if>
    /** Initialize open loop start-up module */
    mcSupI_OpenLoopStartupInit( &mcFoc_State_mds.bOpenLoopStartup );

    /** Initialize reference control module */
    mcRefI_ReferenceControlInit( &mcFoc_State_mds.bReferenceController);
<#if MCPMSMFOC_CONTROL_TYPE == 'POSITION_LOOP' >
    /** Initialize position control module */
    mcPosI_PositionControlInit( &mcFoc_State_mds.bPositionController);
</#if>

    /** Initialize speed control module */
    mcSpeI_SpeedControlInit( &mcFoc_State_mds.bSpeedController);

    /** Initialize torque control module */
    mcTorI_TorqueControlInit( &mcFoc_State_mds.bTorqueController);

    /** Initialize flux control module */
    mcFlxI_FluxControlInit( &mcFoc_State_mds.bFluxController);

<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER'>
    /** Initialize rotor position estimation  */
    mcRpeI_RotorPositionEstimInit( &mcFoc_State_mds.bPositionEstimation);
</#if>

    /** Initialize PWM  module */
    mcPwmI_PulseWidthModulationInit( &mcFoc_State_mds.bPwmModulator );

    /** Set initialization flag */
    mcFoc_State_mds.initDone = true;

}

/**
 * @brief Enable Field Oriented Control (FOC) module
 *
 * @details Enables the FOC module.
 *
 * @param[in] pParameters Pointer to the FOC parameters
 * @param[in,out] None
 * @param[out] None
 * @return None
 */
void  mcFocI_FieldOrientedControlEnable( tmcFocI_ModuleData_s * const pParameters )
{
    /** Get the linked state variable */
    tmcFoc_State_s * pState;
    pState = (tmcFoc_State_s *)pParameters->pStatePointer;

    if( ( NULL == pState ) || ( !pState->initDone ))
    {
         /** Initialize parameters */
        mcFocI_FieldOrientedControlInit(pParameters);
    }
    else
    {
         /** For MISRA Compliance */
    }
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORLESS_ZSMT_HYBRID'>
<#if ( MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER' ) && ( MCPMSMFOC_ENABLE_FLYING_START == true ) >
    /** Enable flying start module */
    mcFlyI_FlyingStartEnable( &mcFoc_State_mds.bFlyingStart );
</#if>
</#if>

    /** Enable open loop start-up module */
    mcSupI_OpenLoopStartupEnable( &mcFoc_State_mds.bOpenLoopStartup );

    /** Enable reference control module */
    mcRefI_ReferenceControlEnable( &mcFoc_State_mds.bReferenceController);

    /** Enable speed control module */
    mcSpeI_SpeedControlEnable( &mcFoc_State_mds.bSpeedController);

<#if MCPMSMFOC_CONTROL_TYPE == 'POSITION_LOOP' >
    /** Enable position control module */
    mcPosI_PositionControlEnable( &mcFoc_State_mds.bPositionController);
</#if>

    /** Enable torque control module */
    mcTorI_TorqueControlEnable( &mcFoc_State_mds.bTorqueController);

    /** Enable flux control module */
    mcFlxI_FluxControlEnable( &mcFoc_State_mds.bFluxController);

<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER'>
    /** Enable rotor position estimation  */
    mcRpeI_RotorPositionEstimEnable( &mcFoc_State_mds.bPositionEstimation);
</#if>

    /** Enable PWM  module */
    mcPwmI_PulseWidthModulationEnable( &mcFoc_State_mds.bPwmModulator );

    /** Set FOC state machine */
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORLESS_ZSMT_HYBRID'>
<#if ( MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER' ) && ( MCPMSMFOC_ENABLE_FLYING_START == true ) >
    mcFoc_State_mds.FocState = FocState_FlyingStart;
<#else>
    mcFoc_State_mds.FocState = FocState_Startup;
</#if>
</#if>

    /** Set enable flag as true */
    pState->enable = true;
}

/**
 * @brief Disable Field Oriented Control (FOC) module
 *
 * @details Disables the FOC module.
 *
 * @param[in] pParameters Pointer to the FOC parameters
 * @param[in,out] None
 * @param[out] None
 * @return None
 */
void  mcFocI_FieldOrientedControlDisable( tmcFocI_ModuleData_s * const pParameters )
{
    /** Get the linked state variable */
    tmcFoc_State_s * pState;
    pState = (tmcFoc_State_s *)pParameters->pStatePointer;

    if( NULL != pState)
    {
        /** Reset state variables  */
        mcFocI_FieldOrientedControlReset(pParameters);
    }
    else
    {
        /** For MISRA Compliance */
    }
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORLESS_ZSMT_HYBRID'>
<#if ( MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER' ) && ( MCPMSMFOC_ENABLE_FLYING_START == true ) >
    /** Disable flying start module */
    mcFlyI_FlyingStartDisable( &mcFoc_State_mds.bFlyingStart );
</#if>
</#if>

    /** Disable open loop start-up module */
    mcSupI_OpenLoopStartupDisable( &mcFoc_State_mds.bOpenLoopStartup );

    /** Disable reference control module */
    mcRefI_ReferenceControlDisable( &mcFoc_State_mds.bReferenceController);
<#if MCPMSMFOC_CONTROL_TYPE == 'POSITION_LOOP' >
    /** Disable position control module */
    mcPosI_PositionControlDisable( &mcFoc_State_mds.bPositionController);
</#if>

    /** Disable speed control module */
    mcSpeI_SpeedControlDisable( &mcFoc_State_mds.bSpeedController);

    /** Disable torque control module */
    mcTorI_TorqueControlDisable( &mcFoc_State_mds.bTorqueController);

    /** Disable flux control module */
    mcFlxI_FluxControlDisable( &mcFoc_State_mds.bFluxController);

<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER'>
    /** Disable rotor position estimation  */
    mcRpeI_RotorPositionEstimDisable( &mcFoc_State_mds.bPositionEstimation);
</#if>

    /** Disable PWM  module */
    mcPwmI_PulseWidthModulationDisable( &mcFoc_State_mds.bPwmModulator );

    /** Set enable flag as true */
    pState->enable = false;

}

/**
 * @brief Execute Field Oriented Control (FOC) fast loop
 *
 * @details Executes the fast loop of the FOC algorithm.
 *
 * @param[in] pModule Pointer to the FOC module data
 * @param[in,out] None
 * @param[out] None
 * @return None
 */
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORLESS_ZSMT_HYBRID'>
void mcFocI_FieldOrientedControlFast( tmcFocI_ModuleData_s * const pModule )
{
<#if ( MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER' ) && ( MCPMSMFOC_ENABLE_FLYING_START == true ) >
    bool dutyOverride = false;
</#if>
    /** Intermediate variables */
    float32_t sine = 0.0f;
    float32_t cosine = 0.0f;

    /** Get the linked state variable */
    tmcFoc_State_s * pState;
    pState = (tmcFoc_State_s *)pModule->pStatePointer;

    /** Get the output structure pointer */
    tmcFoc_Input_s * pInput;
    pInput = &pModule->dInput;

    /** Get the output structure pointer */
    tmcFoc_Output_s * pOutput;
    pOutput = &pModule->dOutput;

    /** Read FOC inputs  */
    mcFocI_InputsRead( pModule );

    /** Clarke transformation */
    mcFoc_ClarkeTransformation( &pInput->iABC, &pOutput->iAlphaBeta);

<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER'>
    /** Rotor position estimation */
    tmcTypes_AlphaBeta_s eAlphaBeta;
    mcRpeI_RotorPositionEstim( &pState->bPositionEstimation, &pOutput->iAlphaBeta, &pOutput->uAlphaBeta,
                               &eAlphaBeta, &pOutput->elecAngle, &pOutput->elecSpeed );
</#if>

    switch(pState->FocState )
    {
<#if ( MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER' ) && ( MCPMSMFOC_ENABLE_FLYING_START == true ) >
        case FocState_FlyingStart:
        {
            tmcTypes_StdReturn_e flyingStartStatus;
            flyingStartStatus = mcFlyI_FlyingStart( &pState->bFlyingStart, pOutput->elecSpeed, pState->commandDirection,
                                                    &pState->iDref, &pState->iQref, &dutyOverride, mcPwmI_Duty_gau16 );

            if( StdReturn_Success == flyingStartStatus )
            {
                /** Set speed controller state */
                mcSpeI_SpeedControlManual( &pState->bSpeedController, 0.0f);

                /** Set flux controller controller state */
                mcFlxI_FluxControlManual(&pState->bFluxController, 0.0f);

                /** Set torque controller state */
                mcTorI_TorqueControlManual(&pState->bTorqueController, 0.0f);

                /** Set FOC state machine to CloseLoop */
                pState->FocState = FocState_CloseLoop;
            }
            else if( StdReturn_Fail == flyingStartStatus )
            {
                /** Set speed controller state */
                mcSpeI_SpeedControlManual( &pState->bSpeedController, 0.0f);

                /** Set flux controller controller state */
                mcFlxI_FluxControlManual(&pState->bFluxController, 0.0f);

                /** Set torque controller state */
                mcTorI_TorqueControlManual(&pState->bTorqueController, 0.0f);

                /** Set FOC state machine to CloseLoop */
                pState->FocState = FocState_Startup;
            }
            else
            {
                /** Stay in flying start state */
            }
            break;
        }
</#if>

        case FocState_Startup:
        {
            tmcTypes_StdReturn_e startupStatus;
<#if 'IPD' == MCPMSMFOC_ALIGN_OR_DETECT_AXIS >
            pState->openLoopAngle = pModule->dInput.initialAngle;
</#if>
            startupStatus = mcSupI_OpenLoopStartup( &pState->bOpenLoopStartup, pState->commandDirection, &pState->iQref,
                                                    &pState->iDref, &pState->openLoopAngle, &pState->openLoopSpeed );

            pState->nRef = pState->openLoopSpeed;

            if( StdReturn_Complete == startupStatus )
            {
<#if ( MCPMSMFOC_CONTROL_TYPE == 'SPEED_LOOP' ) >
                /** Set speed controller state */
                mcSpeI_SpeedControlManual( &pState->bSpeedController, pState->iQref );

<#elseif ( MCPMSMFOC_CONTROL_TYPE == 'TORQUE_LOOP' ) >
                /** Set reference current */
                pState->iQref = mcFoc_FocOverrideCurrent_gdf32;
</#if>
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER'>
                /** Calculate angle difference */
                pState->angleDifference = UTIL_AngleDifferenceCalc( pState->openLoopAngle, pOutput->elecAngle );

                /** Set FOC state machine to ClosingLoop */
                pState->FocState = FocState_ClosingLoop;
<#else>
                /** Set FOC state machine to CloseLoop */
                pState->FocState = FocState_CloseLoop;
</#if>
            }

            /** Sine-cosine calculation */
            mcUtils_SineCosineCalculation( pState->openLoopAngle, &sine, &cosine );

            break;
        }
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER'>
            case FocState_ClosingLoop:
            {
                float32_t angle = pOutput->elecAngle + pState->angleDifference;
                mcUtils_TruncateAngle0To2Pi(&angle);

                /** Ramp-down angle difference */
                UTIL_LinearRampFloat(&pState->angleDifference, ROTOR_ANGLE_RAMP_RATE, 0.0f );

                if( UTIL_IS_ZERO( pState->angleDifference ))
                {
                    pState->angleDifference = 0.0f;
                    pState->FocState = FocState_CloseLoop;
                }

                /** Sine-cosine calculation */
                mcUtils_SineCosineCalculation( angle, &sine, &cosine );

<#if ( MCPMSMFOC_CONTROL_TYPE == 'SPEED_LOOP' ) >
                /** Execute speed controller */
                mcSpeI_SpeedControlAuto( &pState->bSpeedController, pState->nRef, pOutput->elecSpeed,  &pState->iQref );
<#elseif ( MCPMSMFOC_CONTROL_TYPE == 'TORQUE_LOOP' ) >
                /**
                * Note: Set the value of mcFoc_FocOverrideCurrent_gdf32 to appropriate
                *          value before starting the motor with start-stop button
                *
                */
                pState->iQref = mcFoc_FocOverrideCurrent_gdf32;
</#if>
                break;
            }
</#if>

            case FocState_CloseLoop:
            {

<#if MCPMSMFOC_POSITION_CALC_ALGORITHM == 'SENSORED_ENCODER'>
                /** Sine-cosine calculation */
                mcUtils_SineCosineCalculation( pInput->elecAngle, &sine, &cosine );
<#else>
                /** Sine-cosine calculation */
                mcUtils_SineCosineCalculation( pOutput->elecAngle, &sine, &cosine );
</#if>
                /** Reference Control */
                mcRefI_ReferenceControl( &mcFoc_State_mds.bReferenceController, pModule->dInput.reference, &pState->nRef );

<#if ( MCPMSMFOC_CONTROL_TYPE == 'POSITION_LOOP' ) >
                float32_t referenceSpeed = 0.0f;
                mcPosI_PositionControlAuto(&pState->bPositionController,  pState->nRef, pInput->mechanicalAngle,
                                                          &referenceSpeed );

                /** Execute speed controller */
                mcSpeI_SpeedControlAuto(&pState->bSpeedController,  referenceSpeed, pInput->elecSpeed,
                                                          &pState->iQref );
<#elseif ( MCPMSMFOC_CONTROL_TYPE == 'SPEED_LOOP' ) >
                /** Execute speed controller */
                pState->nRef *=  pState->commandDirection;
<#if MCPMSMFOC_POSITION_CALC_ALGORITHM == 'SENSORED_ENCODER'>
                mcSpeI_SpeedControlAuto(&pState->bSpeedController,  pState->nRef, pInput->elecSpeed,
                                        &pState->iQref );
<#else>
                mcSpeI_SpeedControlAuto(&pState->bSpeedController,  pState->nRef, pOutput->elecSpeed,
                                        &pState->iQref );
</#if>

<#elseif ( MCPMSMFOC_CONTROL_TYPE == 'TORQUE_LOOP' ) >
                /**
                * Note: Set the value of mcFoc_FocOverrideCurrent_gdf32 to appropriate
                *          value before starting the motor with start-stop button
                *
                */
                pState->iQref = mcFoc_FocOverrideCurrent_gdf32;
</#if>
                break;
            }

            default:
            {
                /** For MISRA Compliance */
            }
            break;
    }

    /** Park Transformation */
    mcFoc_ParkTransformation( &pOutput->iAlphaBeta, sine, cosine, &pOutput->iDQ );

    /** Compute Q-axis controller output limit */
    float32_t ydLimit = pModule->dInput.uBus * TWO_BY_PI;

    /** Execute flux control */
    mcFlxI_FluxControlAuto( &pState->bFluxController, pState->iDref, pOutput->iDQ.d, ydLimit, &pState->uDQ.d );

    /** Apply circle limit for Q-axis reference current clamping  */
    float32_t yqLimit = UTIL_SquareRootFloat( UTIL_SquareFloat( ydLimit )  - UTIL_SquareFloat( pState->uDQ.d ));


    /** Execute torque control */
    mcTorI_TorqueControlAuto( &pState->bTorqueController, pState->iQref, pOutput->iDQ.q, yqLimit, &pState->uDQ.q );

    /** Inverse Park transformation */
    mcFoc_InverseParkTransformation( &pState->uDQ, sine, cosine, &pOutput->uAlphaBeta );

<#if ( MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER' ) && ( MCPMSMFOC_ENABLE_FLYING_START == true ) >
    if(  false == dutyOverride )
    {
    /** Space vector modulation */
    mcPwmI_PulseWidthModulation(&pState->bPwmModulator, pModule->dInput.uBus, &pOutput->uAlphaBeta, mcPwmI_Duty_gau16 );
    }
<#else>
     /** Space vector modulation */
    mcPwmI_PulseWidthModulation(&pState->bPwmModulator, pModule->dInput.uBus, &pOutput->uAlphaBeta, mcPwmI_Duty_gau16 );
</#if>

<#if ( MCPMSMFOC_ENABLE_MTPA == true ) || ( MCPMSMFOC_ENABLE_FW == true ) >
  <#if ( MCPMSMFOC_POSITION_CALC_ALGORITHM == 'SENSORED_ENCODER' ) >
    mcFlxI_FluxReferenceGet( &pState->bFluxController,  &pState->uDQ, &pOutput->iDQ, 
                                       pInput->elecSpeed, pInput->uBus,  &pState->iDref );
  <#else>
    mcFlxI_FluxReferenceGet( &pState->bFluxController,  &pState->uDQ, &pOutput->iDQ, &eAlphaBeta, 
                                       pOutput->elecSpeed, pInput->uBus,  &pState->iDref );
  </#if>
</#if>
}

<#else>
void mcFocI_FieldOrientedControlFast( tmcFocI_ModuleData_s * const pModule )
{
    /** Intermediate variables */
    float32_t sine = 0.0f;
    float32_t cosine = 0.0f;

    /** Get the linked state variable */
    tmcFoc_State_s * pState;
    pState = (tmcFoc_State_s *)pModule->pStatePointer;

    /** Get the output structure pointer */
    tmcFoc_Input_s * pInput;
    pInput = &pModule->dInput;

    /** Get the output structure pointer */
    tmcFoc_Output_s * pOutput;
    pOutput = &pModule->dOutput;

    /** Read FOC inputs  */
    mcFocI_InputsRead( pModule );

    /** Clarke transformation */
    mcFoc_ClarkeTransformation( &pInput->iABC, &pOutput->iAlphaBeta);

<#if ( MCPMSMFOC_CONTROL_TYPE == 'OPEN_LOOP' ) >
    mcSupI_OpenLoopStartup( &pState->bOpenLoopStartup, pState->commandDirection, &pState->iQref,
                          &pState->iDref, &pState->openLoopAngle, &pState->openLoopSpeed );
</#if>

    /** Rotor position estimation */
    tmcTypes_AlphaBeta_s eAlphaBeta;
    mcRpeI_RotorPositionEstim(&pState->bPositionEstimation, &pOutput->iAlphaBeta, &pOutput->uAlphaBeta,
                                            &eAlphaBeta, &pOutput->elecAngle, &pOutput->elecSpeed );

    /** Reference Control */
    mcRefI_ReferenceControl( &mcFoc_State_mds.bReferenceController, pModule->dInput.reference, &pState->nRef );

    pState->nRef *=  pState->commandDirection;

<#if ( MCPMSMFOC_DEVELOPER_MODE == true ) >
    /** Speed override */
    if( mcFoc_TuningSettings_mds.speedOverride.enableOverride )
    {
        if( mcFoc_TuningSettings_mds.speedOverride.overrideType == CONSTANT ) {
             pState->nRef  = mcFoc_TuningSettings_mds.speedOverride.overrideValue;
        }
        else if( mcFoc_TuningSettings_mds.speedOverride.overrideType == PULSE_PERTURBATION  )
        {
            static uint32_t u32Counter = 0U;
            u32Counter++;
            if( u32Counter <= ( mcFoc_TuningSettings_mds.speedOverride.overridePulseFreq >> 1U ) )  {
                pState->nRef = mcFoc_TuningSettings_mds.speedOverride.overridePulseLow;
            }
            else if( u32Counter < ( mcFoc_TuningSettings_mds.speedOverride.overridePulseFreq ) )  {
                pState->nRef = mcFoc_TuningSettings_mds.speedOverride.overridePulseHigh;
            }
            else {
                u32Counter = 0U;
            }
        }
    }
</#if>
    /** Execute speed control loop when rotor position is valid */
    if( mcRpeI_RotorPositionReady(&pState->bPositionEstimation) )
    {
        /** Execute speed controller */
        mcSpeI_SpeedControlAuto(&pState->bSpeedController, pState->nRef, pOutput->elecSpeed,
                                                &pState->iQref );
    }
    else
    {
        pState->iQref = 0.0f;
    }
<#if ( MCPMSMFOC_DEVELOPER_MODE == true ) >
    if( mcFoc_TuningSettings_mds.openloopControl.enableOpenloopControl ) {
        mcSupI_OpenLoopStartup( &pState->bOpenLoopStartup, pState->commandDirection, &pState->iQref,
                                         &pState->iDref, &mcFoc_TuningSettings_mds.openloopControl.openloopAngle,
                                         &mcFoc_TuningSettings_mds.openloopControl.openloopSpeed );

        pOutput->elecAngle = mcFoc_TuningSettings_mds.openloopControl.openloopAngle;
    }
</#if>
    /** Sine-cosine calculation */
    mcUtils_SineCosineCalculation( pOutput->elecAngle, &sine, &cosine );

    /** Park Transformation */
    mcFoc_ParkTransformation( &pOutput->iAlphaBeta, sine, cosine, &pOutput->iDQ );

    /** Compute Q-axis controller output limit */
    float32_t ydLimit = pModule->dInput.uBus * TWO_BY_PI;

    /** Execute flux control */
<#if ( MCPMSMFOC_DEVELOPER_MODE == true ) >
    if( mcFoc_TuningSettings_mds.idOverride.enableOverride )
    {
        if( mcFoc_TuningSettings_mds.idOverride.overrideType == CONSTANT ) {
             pState->iQref  = mcFoc_TuningSettings_mds.idOverride.overrideValue;
        }
        else if( mcFoc_TuningSettings_mds.idOverride.overrideType == PULSE_PERTURBATION  )
        {
            static uint32_t u32Counter = 0U;
            u32Counter++;
            if( u32Counter <= ( mcFoc_TuningSettings_mds.idOverride.overridePulseFreq >> 1U ) )  {
                pState->iQref = mcFoc_TuningSettings_mds.idOverride.overridePulseLow;
            }
            else if( u32Counter < ( mcFoc_TuningSettings_mds.idOverride.overridePulseFreq ) )  {
                pState->iQref = mcFoc_TuningSettings_mds.idOverride.overridePulseHigh;
            }
            else {
                u32Counter = 0U;
            }
        }
    }
</#if>
    mcFlxI_FluxControlAuto( &pState->bFluxController, pState->iDref, pOutput->iDQ.d, ydLimit, &pState->uDQ.d );

    /** Apply circle limit for Q-axis reference current clamping  */
    float32_t yqLimit = UTIL_SquareRootFloat( UTIL_SquareFloat( ydLimit ) - UTIL_SquareFloat( pState->uDQ.d * pState->uDQ.d ));

    /** Execute torque control */
<#if ( MCPMSMFOC_DEVELOPER_MODE == true ) >
    if( mcFoc_TuningSettings_mds.iqOverride.enableOverride )
    {
        if( mcFoc_TuningSettings_mds.iqOverride.overrideType == CONSTANT ) {
             pState->iQref  = mcFoc_TuningSettings_mds.iqOverride.overrideValue;
        }
        else if( mcFoc_TuningSettings_mds.iqOverride.overrideType == PULSE_PERTURBATION  )
        {
            static uint32_t u32Counter = 0U;
            u32Counter++;
            if( u32Counter <= ( mcFoc_TuningSettings_mds.iqOverride.overridePulseFreq << 1U ) )  {
                pState->iQref = mcFoc_TuningSettings_mds.iqOverride.overridePulseLow;
            }
            else if( u32Counter < ( mcFoc_TuningSettings_mds.iqOverride.overridePulseFreq ) )  {
                pState->iQref = mcFoc_TuningSettings_mds.iqOverride.overridePulseHigh;
            }
            else {
                u32Counter = 0U;
            }
        }
    }
</#if>
    mcTorI_TorqueControlAuto( &pState->bTorqueController, pState->iQref, pOutput->iDQ.q, yqLimit, &pState->uDQ.q );

    /** High Frequency pulse injection */
    mcRpeI_CarrierSignalInjection(&pState->bPositionEstimation, &pState->uDQ);

    /** Inverse Park transformation */
    mcFoc_InverseParkTransformation( &pState->uDQ, sine, cosine, &pOutput->uAlphaBeta );

     /** Space vector modulation */
    mcPwmI_PulseWidthModulation(&pState->bPwmModulator, pModule->dInput.uBus, &pOutput->uAlphaBeta, pModule->dOutput.duty );

    /** Write ouput ports  */
    mcFocI_OutputPortWrite(pOutput);
}
</#if>

/**
 * @brief Execute Field Oriented Control (FOC) slow loop
 *
 * @details Executes the slow loop of the FOC algorithm.
 *
 * @param[in] pParameters Pointer to the FOC parameters
 * @param[in,out] None
 * @param[out] None
 * @return None
 */
void mcFocI_FieldOrientedControlSlow( const tmcFocI_ModuleData_s * const pParameters )
{
    /** ToDO: Put appropriate tasks */
}

/**
 * @brief Change motor direction
 *
 * @details Changes the direction of the motor.
 *
 * @param[in] pModule Pointer to the FOC module data
 * @param[in,out] None
 * @param[out] None
 * @return None
 */
void mcFocI_MotorDirectionChange(const tmcFocI_ModuleData_s * const pParameters)
{
    /** Get the linked state variable */
    tmcFoc_State_s * pState;
    pState = (tmcFoc_State_s *)pParameters->pStatePointer;

    pState->commandDirection = - pState->commandDirection;

}

/**
 * @brief Reset Field Oriented Control (FOC)
 *
 * @details Resets the FOC module.
 *
 * @param[in] pParameters Pointer to the FOC parameters
 * @param[in,out] None
 * @param[out] None
 * @return None
 */
void mcFocI_FieldOrientedControlReset( const tmcFocI_ModuleData_s * const pParameters )
{
    /** Reset reference control module */
    mcRefI_ReferenceControlReset( &mcFoc_State_mds.bReferenceController);

    /** Reset speed control module */
    mcSpeI_SpeedControlReset( &mcFoc_State_mds.bSpeedController);

    /** Reset torque control module */
    mcTorI_TorqueControlReset( &mcFoc_State_mds.bTorqueController);

    /** Reset flux control module */
    mcFlxI_FluxControlReset( &mcFoc_State_mds.bFluxController);

<#if MCPMSMFOC_POSITION_CALC_ALGORITHM != 'SENSORED_ENCODER'>
    /** Reset rotor position estimation  */
    mcRpeI_RotorPositionEstimReset( &mcFoc_State_mds.bPositionEstimation);
</#if>

    /** Reset PWM  module */
    mcPwmI_PulseWidthModulationReset( &mcFoc_State_mds.bPwmModulator );
}
