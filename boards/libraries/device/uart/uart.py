# coding: utf-8
"""*****************************************************************************
* Copyright (C) 2021 Microchip Technology Inc. and its subsidiaries.
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
*****************************************************************************"""
#---------------------------------------------------------------------------------------#
#                                 IMPORTS                                               #
#---------------------------------------------------------------------------------------#
import importlib

#---------------------------------------------------------------------------------------#
#                                 GLOBAL VARIABLES                                      #
#---------------------------------------------------------------------------------------#
SupportedCommPorts = {
    "UART" : [
                { "name": "SERCOM", "id": "U2201"},
                { "name": "UART", "id": "6418"},
                { "name": "UART", "id": "02478"},
                { "name": "FLEXCOM", "id":"11268"}
             ]
    }

def getUARTIP(modules):
    for module in modules:
        for entry in SupportedCommPorts.get("UART", []):
            if ( entry["name"] == module.getAttribute("name") and entry["id"] == module.getAttribute("id") ):
                return entry["name"], entry["id"]
    return "",""

#---------------------------------------------------------------------------------------#
#                                 GLOBAL VARIABLES                                      #
#---------------------------------------------------------------------------------------#

class UartPeripheral:
    def __init__(self, object_wrapper):
        # Get ADC IP from the ATDF file
        ATDF = object_wrapper.get_atdf_object()
        periphNode = ATDF.getNode("/avr-tools-device-file/devices/device/peripherals")
        modules = periphNode.getChildren()

        self.name, self.id = getUARTIP(modules)

        module_name = self.name.lower() + '_' + self.id.lower()
        module = importlib.import_module('device.uart.' + module_name)
        self.uart = module.AdapterService(object_wrapper)

    def set_uart_transmit_pin( self, name, instance, channel, pad):
        self.uart.set_uart_transmit_pin(name, instance, channel, pad)

    def set_uart_receive_pin( self, name, instance, channel, pad):
        self.uart.set_uart_receive_pin(name, instance, channel, pad)








