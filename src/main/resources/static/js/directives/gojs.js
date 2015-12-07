angular.module('gojs-directives', [])
    .directive('goDiagram', function () {
        return {
            restrict: 'E',
            template: '<div></div>',  // just an empty DIV element
            replace: true,
            scope: {model: '=goModel'},
            link: function (scope, element, attrs) {
                var $ = go.GraphObject.make;
                var diagram =  // create a Diagram for the given HTML DIV element
                    $(go.Diagram, element[0],
                        {
                            layout: $(go.TreeLayout, { nodeSpacing: 5 }),
                            nodeTemplate: $(go.Node, "Auto",
                                //{locationSpot: go.Spot.Center},
                                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                                $(go.Shape, "RoundedRectangle", new go.Binding("fill", "color"),
                                    {
                                        portId: "", cursor: "pointer",
                                        fromLinkable: true, toLinkable: true,
                                        fromLinkableSelfNode: true, toLinkableSelfNode: true,
                                        fromLinkableDuplicates: true, toLinkableDuplicates: true
                                    }),
                                $(go.TextBlock, {margin: 3, editable: false},
                                    new go.Binding("text", "name").makeTwoWay())
                            ),
                            linkTemplate: $(go.Link,
                                {relinkableFrom: true, relinkableTo: true},
                                $(go.Shape),
                                $(go.Shape, {toArrow: "OpenTriangle"})
                            ),
                            initialContentAlignment: go.Spot.Center,
                            "animationManager.isEnabled": false
                        });
                // whenever a GoJS transaction has finished modifying the model, update all Angular bindings
                function updateAngular(e) {
                    if (e.isTransactionFinished) scope.$apply();

                }

                // notice when the value of "model" changes: update the Diagram.model
                scope.$watch("model", function (newmodel) {
                    var oldmodel = diagram.model;
                    if (oldmodel !== newmodel) {
                        if (oldmodel) oldmodel.removeChangedListener(updateAngular);
                        newmodel.addChangedListener(updateAngular);
                        diagram.model = newmodel;
                    }
                });
                scope.$watch("model.selectedNodeData.name", function (newname) {
                    // disable recursive updates
                    diagram.model.removeChangedListener(updateAngular);
                    // change the name
                    diagram.startTransaction("change name");
                    // the data property has already been modified, so setDataProperty would have no effect
                    var node = diagram.findNodeForData(diagram.model.selectedNodeData);
                    if (node !== null) node.updateTargetBindings("name");
                    diagram.commitTransaction("change name");
                    // re-enable normal updates
                    diagram.model.addChangedListener(updateAngular);
                });
                // update the model when the selection changes
                diagram.addDiagramListener("ChangedSelection", function (e) {
                    var selnode = diagram.selection.first();
                    diagram.model.selectedNodeData = (selnode instanceof go.Node ? selnode.data : null);
                    scope.$apply();
                });
            }
        };
    }).controller('MinimalCtrl', function ($scope) {
        $scope.model = new go.GraphLinksModel(
            [
                {key: 1, name: "Alpha", color: "lightblue"},
                {key: 2, name: "Beta", color: "orange"},
                {key: 3, name: "Gamma", color: "lightgreen"},
                {key: 4, name: "Delta", color: "pink"}
            ],
            [
                {from: 1, to: 2},
                {from: 1, to: 3},
                {from: 2, to: 2},
                {from: 3, to: 4},
                {from: 4, to: 1}
            ]);
        $scope.model.selectedNodeData = null;
        $scope.replaceModel = function () {
            $scope.model = new go.GraphLinksModel(
                [
                    {key: "zeta", color: "red"},
                    {key: "eta", color: "green"}
                ],
                [
                    {from: "zeta", to: "eta"}
                ]
            );
        }
    })
;
