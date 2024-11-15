/**
 * @brief 
 *    Header file for reference control
 *
 * @File Name 
 *    mc_reference_control.h
 *
 * @Company 
 *   Microchip Technology Inc.
 *
 * @Summary
 *    Header file which contains variables and function prototypes for reference control.
 *
 * @Description
 *    This file contains variables and function prototypes which are generally used for reference
 *    control in pulse width modulation. 
 */

//DOM-IGNORE-BEGIN
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
//DOM-IGNORE-END

#ifndef MCREF_H
#define MCREF_H

/*******************************************************************************
 * Header inclusions
*******************************************************************************/
#include "mc_types.h"
#include "mc_utilities.h"
#include "mc_userparams.h"

/*******************************************************************************
 Default Module configuration parameters
*******************************************************************************/

/*******************************************************************************
 Type Definition
 *******************************************************************************/
/**
 * @brief Structure defining the parameters for the reference control module.
 */
typedef struct
{
<#if ( MCPMSMFOC_CONTROL_TYPE == 'SPEED_LOOP' ) >
    float32_t minimumRpm; /**< Minimum RPM */
    float32_t maximumRpm; /**< Maximum RPM */
    float32_t rpmPerSecond; /**< RPM change per second */
    float32_t dt; /**< Delta time */
</#if>
    void * pStatePointer; /**< Pointer to state information */
} tmcRef_Parameters_s;

/*******************************************************************************
 * Interface variables
 *******************************************************************************/

/*******************************************************************************
 Static Interface Functions
 *******************************************************************************/
/**
 * @brief Set module parameters
 *
 * This function sets the parameters for the reference control module.
 *
 * @param[in] pParameters Pointer to the reference parameters structure
 */
__STATIC_INLINE void mcRefI_ParametersSet(tmcRef_Parameters_s * const pParameters)
{
<#if ( MCPMSMFOC_CONTROL_TYPE == 'SPEED_LOOP' ) >
<#if ( MCPMSMFOC_POSITION_CALC_ALGORITHM == 'SENSORLESS_ZSMT_HYBRID') >
    pParameters->minimumRpm = -(float32_t)${MCPMSMFOC_MAX_SPEED};
<#elseif ( MCPMSMFOC_POSITION_CALC_ALGORITHM == 'SENSORED_ENCODER')>
    pParameters->minimumRpm = (float32_t)0.0f;
<#else>
    pParameters->minimumRpm = (float32_t)${MCPMSMFOC_OPEN_LOOP_END_SPEED};
</#if>
<#if MCPMSMFOC_ENABLE_FW == true>
    pParameters->maximumRpm = (float32_t)${MCPMSMFOC_MAX_SPEED};
<#else>
    pParameters->maximumRpm = (float32_t)${MCPMSMFOC_RATED_SPEED};
</#if>

<#if MCPMSMFOC_RAMP_PROFILES == 'Linear'>
    pParameters->rpmPerSecond = (float32_t)(${MCPMSMFOC_RAMP_PROFILER_MAX_SPEED});
    pParameters->dt = (float32_t)(${MCPMSMFOC_PWM_PERIOD});
</#if>
</#if>
}

/*******************************************************************************
 Interface Functions
 *******************************************************************************/
/**
 * @brief Initialize reference control module
 *
 * This function initializes the reference control module.
 *
 * @param[in] pParameters Pointer to the reference parameters structure
 */
void mcRefI_ReferenceControlInit(tmcRef_Parameters_s * const pParameters);

/**
 * @brief Enable reference control module
 *
 * This function enables the reference control module.
 *
 * @param[in] pParameters Pointer to the reference parameters structure
 */
void mcRefI_ReferenceControlEnable(tmcRef_Parameters_s * const pParameters);

/**
 * @brief Disable reference control module
 *
 * This function disables the reference control module.
 *
 * @param[in] pParameters Pointer to the reference parameters structure
 */
void mcRefI_ReferenceControlDisable(tmcRef_Parameters_s * const pParameters);

#ifdef RAM_EXECUTE
/**
 * @brief Reference control
 *
 * This function performs the reference control.
 *
 * @param[in] pParameters Pointer to the reference parameters structure
 * @param[in] command The command input
 * @param[out] pOut Pointer to the output
 */
void __ramfunc__ mcRefI_ReferenceControl(tmcRef_Parameters_s * const pParameters,
                                         const int16_t command, int16_t * const pOut);
#else
/**
 * @brief Reference control
 *
 * This function performs the reference control.
 *
 * @param[in] pParameters Pointer to the reference parameters structure
 * @param[in] command The command input
 * @param[out] pOut Pointer to the output
 */
void mcRefI_ReferenceControl(tmcRef_Parameters_s * const pParameters,
                             const int16_t command, int16_t * const pOut);
#endif

/**
 * @brief Reset reference control
 *
 * This function resets the reference control.
 *
 * @param[in] pParameters Pointer to the reference parameters structure
 */
void mcRefI_ReferenceControlReset(tmcRef_Parameters_s * const pParameters);

#endif // MCREF_H
