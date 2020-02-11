'use strict';

import {
    Alert,
    Dimensions
} from 'react-native';

import {
    NavigationActions,
    StackActions
} from 'react-navigation';

export function _ResetInnerNavigation(route) {
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: route })
        ]
    })
    this.props.navigation.dispatch(resetAction)
}

export function _ResetOuterNavigation(route) {
    const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: route })]
    })

    this.props.screenProps.outerNavigation.dispatch(resetAction)
}

export function _navigateTo(routeName,$this) {
    const resetAction = StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName })]
    })
    $this.props.navigation.dispatch(resetAction)
}

export function _navigateToWithParam($this,routeName,params){
    const resetAction = StackActions.reset({
        index: 0,
        key: null,
        actions: [NavigationActions.navigate({ routeName, params })]
    })

    $this.props.navigation.dispatch(resetAction);

}

export function _genericAlertWithClose(title,description,routeName,$this){
    Alert.alert(title, description,
    [
        {
            text: 'Close', onPress: () => {
                // console.log('function for returning to login');
                if(routeName !== undefined) _navigateTo(routeName,$this);
                return;
            }, style: 'cancel'
        },
    ],
    { cancelable: false }
);
}

export default {
    totalWidth:Dimensions.get('window').width-(Dimensions.get('window').width*0.1)
}